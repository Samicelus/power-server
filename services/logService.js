const path = require('path');
const moment = require('moment');
moment.locales('zh-cn');
const Operation_log = require(path.join(__dirname, '../models/operation_log.js'));
const User = require(path.join(__dirname, '../models/user.js'));
const BaseHandler = require(path.join(__dirname, '../lib/baseHandler.js'));
let handlers = new BaseHandler();

handlers.listLog = async function(ctx, next){
  let query = ctx.query;
  let {search, type, page=1, pageSize=10} = query;
  
  let condition = {
    type
  };

  if(search){
    if(type == "login"){
      condition.ip = search;
    }
    if(type == "operate"){
      let user_oids = await User.distinct("_id",{username:{$regex:search}});
      condition.user_oid = {$in: user_oids};
    }
  }

  let list = await Operation_log.find(condition)
  .populate({path:"user_oid", select:"_id nickname username"})
  .select(`type ip log current_role_name created`)
  .sort({"created":-1})
  .skip((Number(page)-1)*Number(pageSize))
  .limit(Number(pageSize))
  .lean();

  let count = await Operation_log.count(condition)
  return handlers.restSuccess(ctx, {list, page, pageSize, count});
};

module.exports = handlers;