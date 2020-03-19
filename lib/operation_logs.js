
const path = require('path');
const _ = require('lodash');
const Operation_log = require(path.join(__dirname, '../models/operation_log.js'));
const moment = require('moment');
moment.locale('zh-cn');
const models = require('../lib/models');

class Operation{
  constructor(){
    this.record = this.record.bind(this);
  }

  record(log_param){
    return async function(ctx, next){
      if(log_param.pre_grep && log_param.refs){
        let refs = log_param.refs;
        let ref_map = {};
        if(typeof refs == "object"){
          let ref_keys = Object.keys(refs);
          ref_keys.forEach((key)=>{
            let replacement = _.get(ctx, refs[key]);
            ref_map[key] = replacement;
          })
        }
        
        let pre_grep = log_param.pre_grep;
        if(typeof pre_grep == "object"){
          log_param.pre_grep_map = {};
          for(let key in pre_grep){
            let grep_phrase = pre_grep[key];
            let replacement = (await grepFromModel(grep_phrase, ref_map)) || "未找到";
            log_param.pre_grep_map[key] = replacement
          }
        }
        console.log(log_param);
      }
      
      ctx.log_param = log_param;
      await next();
    }
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


module.exports  = new Operation();