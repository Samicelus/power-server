const path = require('path');
const _ = require('lodash');
const Operation_log = require(path.join(__dirname, '../models/operation_log.js'));
const {MODULEMAP} = require('../const/modules/constants');
const models = require('../lib/models');

const errorHandler = async (ctx, next) => {
    try{
      await next();
    }catch(err){
      //记录错误日志
      if(ctx.log_param){
            let request_address = ctx.ip.split(':');
            let ip = request_address[request_address.length-1];
            let user = ctx.request.user_info;
            let user_oid;
            let current_role_name;
            if(user){
                user_oid = user._id;
                current_role_name = user.role;
            }
            ctx.log_param.state = "fail";
            ctx.log_param.error = err;
            let log = await combineLog(ctx.log_param, ctx);
            let temp = {
                ip,
                log
            };
            let type = ctx.log_param.type;
            if(type){
                temp.type = type;
            }
            if(user_oid){
                temp.user_oid = user_oid;
            }
            if(current_role_name){
                temp.current_role_name = current_role_name;
            }
            await saveLog(temp);
        }
      console.error(err);
      ctx.response.status = err.statusCode || err.status || 500;
      ctx.response.body = {
          error: 500,
          message: err.message
      }
    }
}


async function combineLog(param, ctx){
    let state = param.state;
    if(param.template && param.template[state]){
        let template = param.template[state];
        let module_regex = /\[module\]/g;
        if(module_regex.test(template)){
            template = template.replace(module_regex, MODULEMAP[param.module]);
        }

        let error_regex = /\[error\]/g;
        if(error_regex.test(template)){
            let error_message = param.error ? param.error.message : "";
            template = template.replace(error_regex, error_message);
        }
        let refs = param.refs;
        let ref_map = {};
        if(typeof refs == "object"){
            let ref_keys = Object.keys(refs);
            ref_keys.forEach((key)=>{
                let ref_regex = new RegExp(`\\$\\{${key}\\}`,"g");
                let replacement = _.get(ctx, refs[key]);
                ref_map[key] = replacement;
                if(ref_regex.test(template)){
                    template = template.replace(ref_regex, replacement);
                }
            })
        }
        let grep = param.grep;
        if(typeof grep == "object"){
            for(let key in grep){
                let grep_regex = new RegExp(`\\$\\$\\[${key}\\]`,"g");
                if(grep_regex.test(template)){
                    let grep_phrase = grep[key];
                    let replacement = (await grepFromModel(grep_phrase, ref_map)) || "未找到";
                    template = template.replace(grep_regex, replacement);
                }
            }
        }
        
        let pre_grep = param.pre_grep_map;
        if(typeof pre_grep == "object"){
            let pre_grep_keys = Object.keys(pre_grep);
            pre_grep_keys.forEach((key)=>{
                let pre_grep_regex = new RegExp(`\\$\\[${key}\\]`,"g");
                let replacement = _.get(pre_grep, key);
                if(pre_grep_regex.test(template)){
                    template = template.replace(pre_grep_regex, replacement);
                }
            })
        }
        return template;
    }else{
        return "";
    }
}

async function grepFromModel(grep_phrase, ref_map){
    // "user>user_id:role_oid>name"
    let part_arr = grep_phrase.split(':');
    let model_part = part_arr[0].split('>');
    let model_name = model_part[0];
    let id_name = model_part[1];

    let model = models[model_name];
    let id = ref_map[id_name];

    let select_part = part_arr[1].split('>');
    let populate_opt = {};
    populate_opt = formPopulation(select_part, 0, populate_opt ,populate_opt);
    let data;
    if(populate_opt){
        let arr = await model.find({"_id":{$in: id}}).populate(populate_opt).lean();
        let data_arr = [];
        arr.forEach((item)=>{
            data_arr.push(_.get(item, select_part.join('.'), "")) 
        })
        data = data_arr.join(',');
    }else{
        let arr = await model.find({"_id":{$in: id}}).lean();
        let data_arr = [];
        arr.forEach((item)=>{
            data_arr.push(_.get(item, select_part.join('.'), "")) 
        })
        data = data_arr.join(',');
    }

    return data;
}

function formPopulation(select_part, index=0, current_level ,opt){
    if(index < select_part.length - 2){
        current_level.path = select_part[index];
        current_level.populate = {};
        return formPopulation(select_part, index+1, current_level.populate ,opt)
    }else if(index == select_part.length - 2){
        current_level.path = select_part[index];
        current_level.select = select_part[index + 1];
        return opt;
    }else{
        return "";
    }
}

async function saveLog(log_obj){
    await Operation_log(log_obj).save();
}
module.exports = errorHandler;