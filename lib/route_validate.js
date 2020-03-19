const Joi = require('@hapi/joi');
const j2s = require('joi-to-swagger');
const path = require('path');
const white_list_api = require(`../config/serverConfig.json`).white_list_api;

class VALIDATE{
  constructor(){
    this.validate = this.validate.bind(this)
  }
  validate(validate, route_info){

    if(route_info){
      // {
      //   method: 'post',
      //   description: '删除所有操作/登录日志',
      //   path: `/api/${base}/deletAllLogs`,
      //   modules: ["log-manage"]
      // }
      if(!global.swaggerSpec.paths[route_info.path]){
        global.swaggerSpec.paths[route_info.path] = {};
      }
      global.swaggerSpec.paths[route_info.path][route_info.method.toLowerCase()] = {
        tags: route_info.modules,
        summary: route_info.description,
        produces: ["application/json"],
        parameters:[],
        responses: {
          "200":{
            "description": "请求成功"
          },
          "400":{
            "description": "参数校验失败"
          },
          "401":{
            "description": "无授权"
          },
          "404":{
            "description": "没有该接口"
          },
          "500":{
            "description": "请求失败"
          }
        }
      };
      if(validate && validate.payload){  
        global.swaggerSpec.paths[route_info.path][route_info.method.toLowerCase()].parameters.push({
          in: "body",
          name: "body",
          required: true,
          schema: j2s(validate.payload).swagger
        });
      }
      if(validate && validate.query){
        //validate.query._inner.children.forEach((item)=>{
          validate.query['$_terms'].keys.forEach((item)=>{
          let key = item.key;
          let schema = j2s(item.schema).swagger;
          global.swaggerSpec.paths[route_info.path][route_info.method.toLowerCase()].parameters.push({
            in: "query",
            name: key,
            schema: schema
          })
        });
      }
      if(!white_list_api.includes(route_info.path)){
        global.swaggerSpec.paths[route_info.path][route_info.method.toLowerCase()].parameters.push({
          in: "header",
          name: "b-json-web-token",
          type: "string"
        })
      }
    }

    return async function(ctx, next){
      let data = {};
      if(validate && validate.query && ctx.query){
        data.query = ctx.query;
      }
      if(validate && validate.payload && ctx.request.body){
        data.payload = ctx.request.body;
      }
      let result;
      if(validate){
        let schema = Joi.object(validate);
        result = schema.validate(data);
      }
      
      if(result && result.error){
        ctx.response.status = 400;
        ctx.response.body = {
          code: 400,
          error: 'validation fail',
          message: result.error.message,
        };
      }else{
        await next();
      }
    }
  }

}

module.exports = new VALIDATE()
