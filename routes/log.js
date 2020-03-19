const path = require('path');
const handler = require(path.join(__dirname,'../services/logService.js'));
const access = require('../lib/jwt.js').access_check;
const Joi = require('@hapi/joi');
const validate = require('../lib/route_validate.js').validate;
const {TYPES} = require('../const/operations/constants');
const record = require('../lib/operation_logs').record;

module.exports = (router, base)=>{

  //日志列表
  router.get(
    `/api/${base}/listLog`,
    access([
      {module:"log-manage",power:"view"}
    ]),
    validate({   //配置参数校验权限
      query:Joi.object().keys({
        type: Joi.string().valid(TYPES.join(' ')).required().description('日志的类型 login-登录日志, operate-操作日志'),
        search: Joi.string().optional().description('筛选条件， 精确匹配请求ip或模糊匹配用户名'),
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).max(200).optional()
      })
    },{
      method: 'get',
      description: '日志列表',
      path: `/api/${base}/listLog`,
      modules: ["log-manage"]
    }),
    handler.listLog
  );

};