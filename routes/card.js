const path = require('path');
const handler = require(path.join(__dirname,'../services/cardService.js'));
const access = require('../lib/jwt.js').access_check;
const Joi = require('@hapi/joi');
const validate = require('../lib/route_validate.js').validate;
const {TYPES} = require('../const/operations/constants');
const PLANTTYPES = require('../const/gameInfo').PLANTTYPES;
const record = require('../lib/operation_logs').record;

module.exports = (router, base)=>{

  //卡组列表
  router.get(
    `/api/${base}/listCardSets`,
    access([
      {module:"card",power:"view"}
    ]),
    validate({   //配置参数校验权限
      query:Joi.object().keys({
        name: Joi.string().description('卡组名称'),
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).max(200).optional(),
        sortField: Joi.string().description('排序字段'),
        sortOrder: Joi.string().description('升降序')
      })
    },{
      method: 'get',
      description: '卡组列表',
      path: `/api/${base}/listCardSets`,
      modules: ["card"]
    }),
    handler.listCardSet
  );

  //添加卡组
  router.post(
    `/api/${base}/addCardSet`,
    access([
      {module:"card",power:"create"}
    ]),
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        name: Joi.string().description('卡组名称'),
        description: Joi.string().description('简介')
      })
    },{
      method: 'post',
      description: '添加卡组',
      path: `/api/${base}/addCardSet`,
      modules: ["card"]
    }),
    handler.addCardSet
  );

  //卡组内卡牌列表
  router.get(
    `/api/${base}/listCards`,
    access([
      {module:"card",power:"view"}
    ]),
    validate({   //配置参数校验权限
      query:Joi.object().keys({
        set_id: Joi.string().description('卡组id'),
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).max(200).optional(),
        sortField: Joi.string().description('排序字段'),
        sortOrder: Joi.string().description('升降序'),
        "plantType[]": Joi.array().items(Joi.string().valid(...PLANTTYPES)).description('电厂类型'),
      })
    },{
      method: 'get',
      description: '卡组内卡牌列表',
      path: `/api/${base}/listCards`,
      modules: ["card"]
    }),
    handler.listCards
  );

  //添加卡牌
  router.post(
    `/api/${base}/addCard`,
    access([
      {module:"card",power:"create"}
    ]),
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        set_id: Joi.string().required().description('卡组id'),
        order: Joi.number().min(0).description('卡牌序号'),
        plantType: Joi.string().valid(...PLANTTYPES).description('电厂类型'),
        consume: Joi.number().min(0).max(3).description('资源消耗'),
        produce: Joi.number().min(1).max(7).description('产能'),
      })
    },{
      method: 'post',
      description: '添加卡牌',
      path: `/api/${base}/addCard`,
      modules: ["card"]
    }),
    handler.addCard
  );

  //编辑卡牌
  router.post(
    `/api/${base}/editCard`,
    access([
      {module:"card",power:"modify"}
    ]),
    validate({   //配置参数校验权限
      payload:Joi.object().keys({
        card_id: Joi.string().required().description('卡牌id'),
        order: Joi.number().min(0).description('卡牌序号'),
        plantType: Joi.string().valid(...PLANTTYPES).description('电厂类型'),
        consume: Joi.number().min(0).max(3).description('资源消耗'),
        produce: Joi.number().min(1).max(7).description('产能'),
      })
    },{
      method: 'post',
      description: '编辑卡牌',
      path: `/api/${base}/editCard`,
      modules: ["card"]
    }),
    handler.editCard
  );

  //删除卡牌
  router.delete(
    `/api/${base}/:cardId/delete`,
    access([
      {module:"card",power:"remove"}
    ]),
    validate({   //配置参数校验权限
    },{
      method: 'delete',
      description: '删除卡牌',
      path: `/api/${base}/:cardId/delete`,
      modules: ["card"]
    }),
    handler.deleteCard
  );

  //获取卡牌详情
  router.get(
    `/api/${base}/getCardDetail`,
    access([
      {module:"card",power:"view"}
    ]),
    validate({   //配置参数校验权限
      query:Joi.object().keys({
        card_id: Joi.string().description('卡牌id')
      })
    },{
      method: 'get',
      description: '获取卡牌详情',
      path: `/api/${base}/getCardDetail`,
      modules: ["card"]
    }),
    handler.getCardDetail
  );
};