const path = require('path');
const handler = require(path.join(__dirname,'../services/userService.js'));
const access = require('../lib/jwt.js').access_check;
const Joi = require('@hapi/joi');
const validate = require('../lib/route_validate.js').validate;
const record = require('../lib/operation_logs').record;

module.exports = (router, base)=>{

  //用户列表
  router.get(
    `/api/${base}/userList`,
    access([      //配置接口的调用权限
      {module:"system|user",power:"view"}    //调用角色需要拥有 user 模块的 view 权限
    ]),
    validate({   //配置参数校验权限
      query:Joi.object().keys({
        search: Joi.string().optional(),
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).max(200).optional()
      })
    },
    {
      method: 'get',
      description: '用户列表',
      path: `/api/${base}/userList`,
      modules: ["system|user"]
    }),
    handler.userList
  );

  //用户登录
  router.post(
    `/api/${base}/login`,
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        login: Joi.string().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*()]{3,30}$/).required()
      })
    },
    {
      method: 'post',
      description: '用户登录',
      path: `/api/${base}/login`,
      modules: ["personal|account"]
    }),
    record({
      type: "login",
      template:{
        success: "登录成功:用户:${login}(${role}),登录成功",
        fail: "登录失败,尝试用户名:${login}"
      }, 
      refs: {
        "login": "request.body.login",
        "role": "request.user_info.role"
      }
    }),
    handler.login
  );

  //删除用户
  router.post(
    `/api/${base}/deleteUser`,
    access([      //配置接口的调用权限
      {module:"system|user",power:"delete"}    //调用角色需要拥有 user 模块的 delete 权限
    ]),
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        user_id: Joi.string().regex(/^[a-f0-9]{24,24}$/).required()
      })
    },
    {
      method: 'post',
      description: '删除用户',
      path: `/api/${base}/deleteUser`,
      modules: ["system|user"]
    }),
    record({
      module: "system|user",
      template:{
        success: "[module],删除用户成功,被删除用户:$[target_user_name]",
        fail: "[module],删除用户失败,尝试删除用户:$$[target_user_name]"
      },
      refs: {
        "user_id": "request.body.user_id"
      },
      pre_grep: {
        "target_user_name": "user>user_id:username"
      },
      grep: {
        "target_user_name": "user>user_id:username"
      }
    }),
    handler.deleteUser
  );

  //解锁被锁定登录的用户
  router.post(
    `/api/${base}/unlockUser`,
    access([      //配置接口的调用权限
      {module:"system|user",power:"modify"}    //调用角色需要拥有 user 模块的 delete 权限
    ]),
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        user_id: Joi.string().regex(/^[a-f0-9]{24,24}$/).required()
      })
    },
    {
      method: 'post',
      description: '解锁被锁定登录的用户',
      path: `/api/${base}/unlockUser`,
      modules: ["system|user"]
    }),
    handler.unlockUser
  );

  //重置用户密码
  router.post(
    `/api/${base}/resetPWD`,
    access([      //配置接口的调用权限
      {module:"system|user",power:"modify"}    //调用角色需要拥有 user 模块的 create 权限
    ]),
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        user_id: Joi.string().regex(/^[a-f0-9]{24,24}$/).required()
      })
    },
    {
      method: 'post',
      description: '重置用户密码',
      path: `/api/${base}/resetPWD`,
      modules: ["system|user"]
    }),
    handler.resetPwd
  );

  //确认登录
  router.get(
    `/api/${base}/checkLogin`,
    validate(
      null,
      {
        method: 'get',
        description: '确认登录',
        path: `/api/${base}/checkLogin`,
        modules: ["personal|account"]
      }
    ),
    handler.checkLogin
  );

  //获取个人中心帐号设置页面数据
  router.get(
    `/api/${base}/getAccountImformations`,
    access([{ module: "personal|account", power: "view" }]),
    validate(
      null,
      {
        method: 'get',
        description: '获取个人中心帐号设置页面数据',
        path: `/api/${base}/getAccountImformations`,
        modules: ["personal|account"]
      }
    ),
    handler.getAccountImformations
  );

  //设置个人信息
  router.post(
    `/api/${base}/setAccount`,
   access([
      { module: "personal|account", power: 'modify' },
      { module: "personal|message", power: 'modify' }
    ]),
    validate({
      payload: Joi.object().keys({
        nickname: Joi.string(),
        phone: Joi.string().regex(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/),
        email: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
        province: Joi.string(),
        city: Joi.string(),
        area: Joi.string(),
        isMessageNotify: Joi.boolean(),
        isEmailNotify: Joi.boolean(),
        isModalNotify: Joi.boolean()
      })
    },
    {
      method: 'post',
      description: '设置个人信息',
      path: `/api/${base}/setAccount`,
      modules: ["personal|account","personal|message"]
    }), 
    handler.setAccount
  );

  //修改用户密码
  router.post(
    `/api/${base}/changePassword`,
   access([
    { module: "personal|account", power: "modify" }
    ]),
    validate({
      payload: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required().regex(/(?!^(\d+|[a-zA-Z]+|[~!@#$%\\^&*?{}+=-]+)$)^[\w~!@#$%\\^&*?{}+=-]+$/),
      })
    },
    {
      method: 'post',
      description: '修改用户密码',
      path: `/api/${base}/changePassword`,
      modules: ["personal|account"]
    }),
    record({
      module: "personal|account",
      template:{
        success: "[module],修改密码成功,操作用户:${target_user_name}",
        fail: "[module],修改密码失败,操作用户:${target_user_name}"
      },
      refs: {
        "target_user_name": "request.user_info.username"
      }
    }),
    handler.changePassword
  );

  //获取用户消息设定
  router.get(
    `/api/${base}/getMessageSettings`,
    access([{ module: "personal|message", power: "view" }]),
    validate(
      null,
      {
        method: 'get',
        description: '获取用户消息设定',
        path: `/api/${base}/getMessageSettings`,
        modules: ["personal|message"]
      }
    ),
    handler.getMessageSettings
  );

  router.get(
    `/api/${base}/getMessageSettings`,
    handler.test
  );
};