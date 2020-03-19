const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const send = require('koa-send');
const moment = require('moment');
moment.locale('zh-cn');
const _ = require('lodash');
const redisPromise = require('../lib/redis-promise.js').redisClient;
const auth = require('../lib/auth.js')(redisPromise);
const JWT = require('../lib/jwt.js');
const serverConfig = require(`../config/serverConfig.json`);
const redisClient = require('../lib/redis-promise').redisClient;

const User = require(path.join(__dirname, '../models/user.js'));
const Role = require(path.join(__dirname, '../models/role.js'));
const BaseHandler = require(path.join(__dirname, '../lib/baseHandler.js'));
let handlers = new BaseHandler();


handlers.login = async function (ctx, next){
  let requestIp = ctx.ip;
  let body = ctx.request.body;
  let login = body.login;
  let key = `userLock:${login}`;

  return redisClient.getAsync(key).then(async (rst)=>{
    if(rst && rst>4){
      throw new Error(`max login times error!`);
    }
    let password = body.password;
    let user = await User.schema.findOne({
      username: login
    }).populate({
      path:`role_oid`,
      select: `name is_admin access`
    });
  
    if(!user){
      throw new Error(`login/password not correct!`);
    }
  
    let expired = user.expired;
    let now_time = moment().format('YYYY-MM-DD HH:mm:ss');
  
    if(expired && expired<now_time){
      throw new Error(`user expired!`);
    }
  
    let pwd = user.password
    let result = auth.comparePassword(password, pwd);
    if(result){
      let payload = {
        user_id: user._id
      }
      //为登录日志记录数据
      ctx.request.user_info = {
        role: user.role_oid.name,
        access: user.role_oid.access,
        is_admin: user.role_oid.is_admin
      }
      return handlers.restSuccess(ctx, {
        token: JWT.generate(payload),
        user_id: user._id,
        is_admin: user.role_oid.is_admin,
        nickname: user.nickname,
        avatar: user.avatar,
        access: user.role_oid.access
      });
    }else{
      redisClient.incrAsync(key).then((rst)=>{
        console.log(rst);
        return redisClient.expireAsync(key, 10*60);
      }).then(async (rst)=>{
        await User.findByIdAndUpdate(user._id, {"$set":{"lockedKey":key}});
        console.log(rst);
      }).catch((e)=>{
        console.error(`redis error en incr ${key} by 1`);
        console.error(e.stack);
      });
      throw new Error(`login/password not correct!`);
    }
  }).catch((e)=>{
    throw e;
  })
};

handlers.unlockUser = async function (ctx, next){
  let body = ctx.request.body;
  let user_id = body.user_id;
  let user = await User.findById(user_id);
  if(!user){
    throw new Error(`user not found!`);
  }
  let lockedKey = user.lockedKey;
  console.log(lockedKey);
  return redisClient.delAsync(lockedKey).then((rst)=>{
    return handlers.restSuccess(ctx, {user});
  }).catch((e)=>{
    throw new Error(`error when unlock user!`);
  })
};

handlers.userList = async function (ctx, next){
  let query = ctx.query;
  const {search, page=1, pageSize=10} = query;
  
  //let admin_role_ids = await Role.distinct("_id",{is_admin:true});
  
  let condition = {
    //role_oid: {$nin: admin_role_ids}
  };
  if(search){
    condition["$or"] = [
      {
        "username": {"$regex": search}
      },
      {
        "nickname": {"$regex": search}
      }
    ]
  }

  let list = await User.find(condition)
  .populate({path:"role_oid", select:"_id name is_admin"})
  .select(`username nickname email phone created expired`)
  .sort({"created":-1})
  .skip((Number(page)-1)*Number(pageSize))
  .limit(Number(pageSize))
  .lean();
  let count = await User.count(condition);
  return handlers.restSuccess(ctx, {list,page,pageSize,count});
};

handlers.deleteUser = async function (ctx, next){
  let body = ctx.request.body;
  let user_id = body.user_id;
  let user = await User.findByIdAndRemove(user_id);
  if(!user){
    throw new Error(`user not found!`);
  }
  return handlers.restSuccess(ctx, {user});
};

handlers.resetPwd = async function (ctx, next){
  let body = ctx.request.body;
  let user_id = body.user_id;
  let user = await User.findById(user_id);
  if(!user){
    throw new Error(`user not found!`);
  }
  let password = auth.randomPwd();
  user.pwd = auth.computeHash(password, auth.generate16salt(user._id))
  await user.save()
  return handlers.restSuccess(ctx, {password});
};

handlers.checkLogin = async function(ctx, next){
  let user = ctx.request.user_info;
  return handlers.restSuccess(ctx, {status:"ok", user_id: user._id, nickname:user.nickname, avatar:user.avatar, is_admin:user.is_admin, access:user.access});
};

handlers.getAccountImformations = async function(ctx, next) {
  let user = ctx.request.user_info;
  let user_id = user._id;
  if (!user_id) {
    throw new Error("user not found!");
  }
  let data = await User.findById(user_id).select(
    `_id nickname province city area phone email`,
  );
  return handlers.restSuccess(ctx, { data });
};

handlers.setAccount = async function (ctx, next) {
  let user = ctx.request.user_info;
  let user_id = user._id;
  let body = ctx.request.body;
  let nickname = body.nickname;
  let phone = body.phone;
  let email = body.email;
  let province = body.province;
  let city = body.city;
  let area = body.area;
  let isMessageNotify = body.isMessageNotify;
  let isEmailNotify = body.isEmailNotify;
  let isModalNotify = body.isModalNotify;
  let user_obj = {}
  if(nickname){
    user_obj.nickname = nickname;
  }
  if(phone){
    user_obj.phone = phone;
  }
  if(email!==undefined){
    user_obj.email = email;
  }
  if(province){
    user_obj.province = province;
  }
  if(city){
    user_obj.city = city;
  } 
  if(area){
    user_obj.area = area; 
  }
  if(isMessageNotify){
    user_obj.isMessageNotify = isMessageNotify
  }
  if(isEmailNotify){
    user_obj.isEmailNotify = isEmailNotify
  }
  if(isModalNotify){
    user_obj.isModalNotify = isModalNotify
  }
  await User.findByIdAndUpdate(user_id, {$set: user_obj})
  return handlers.restSuccess(ctx, {});
}

handlers.changePassword = async function (ctx, next) {
  let user = ctx.request.user_info;
  let user_id = user._id;
  let body = ctx.request.body;
  let oldPassword = body.oldPassword;
  let newPassword = body.newPassword;
  
  let data = await User.findById(user_id).select('pwd').lean();
  let result = auth.comparePassword(oldPassword, data.pwd);

  if (result) {
    let new_user = await User.findByIdAndUpdate(user_id, { $set: { pwd:auth.computeHash(newPassword, auth.generate16salt(user._id))}});
    return handlers.restSuccess(ctx, {new_user});
  } else {
    throw new Error('password not correct!')
  }
}

//获取消息设置页面目前的通知状态
handlers.getMessageSettings = async function(ctx, next) {
  let user = ctx.request.user_info;
  let user_id = user._id;
  let data = await User.findById(user_id).select(
    `isMessageNotify isEmailNotify isModalNotify`,
  );
  return handlers.restSuccess(ctx, { data });
};

handlers.test = async function(ctx, next){
  let query = ctx.query;
  let user = ctx.request.user_info;
  return handlers.restSuccess(ctx, {user});
}

module.exports = handlers;