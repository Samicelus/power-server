const URL = require('url');
const jwt = require('jsonwebtoken');
const path = require('path');
const serverConfig = require(`../config/serverConfig.json`);
const User = require(path.join(__dirname, '../models/user.js'));
const Role = require(path.join(__dirname, '../models/role.js'));
const moment = require('moment');
moment.locale('zh-cn');

class JWT{
  constructor(){
    this.auth = this.auth.bind(this);
    this.socket_auth = this.socket_auth.bind(this);
    this.access_check = this.access_check.bind(this);
    this.generate = this.generate.bind(this);
    this.verify = this.verify.bind(this);
    this.local_hosts = ["127.0.0.1"];
  }

  async auth(ctx, next){
    let url = URL.parse(ctx.request.url);
    let jwt = ctx.request.header["b-json-web-token"];
    let white_list_api = serverConfig.white_list_api;
    let decode_result;
    if(white_list_api.includes(url.pathname)){
      await next();
    }else{
      decode_result = await this.verify(jwt);
      let verified = false;
      if(decode_result.result){
        if(decode_result.decoded && decode_result.decoded.user_id){
          console.log(`user_id: ${decode_result.decoded.user_id}`)
          let user = await User.schema.findById(decode_result.decoded.user_id).populate('role_oid').select('username nickname phone avatar').lean();
          if(user){
            let expired = user.expired;
            let now_time = moment().format('YYYY-MM-DD HH:mm:ss');
            if(expired && expired < now_time){
              decode_result.message = `user expired`;
            }else{
              user.role = user.role_oid.name;
              user.access = user.role_oid.access;
              user.is_admin = user.role_oid.is_admin;
              delete user.role_oid;
              ctx.request.user_info = user;
              verified = true;
            }
          }else{
            decode_result.message = `no authorized user found`;
          }
        }else{
          decode_result.message = `malformed user info`;
        }
      }
      if(verified){
        await next();
      }else{
        ctx.response.status = 401;
        ctx.response.body = {
          code: 401,
          error: "Unauthorized",
          message: decode_result.message
        };
      }
    }
  }

  async socket_auth(token, socket, data){
    let socket_address = socket.conn.remoteAddress.split(':');
    let socket_ip = socket_address[socket_address.length-1];
    let verified = false;
    let decode_result
    if(socket_ip && this.local_hosts.includes(socket_ip)){
      verified = true;
    }else{
      decode_result = await this.verify(token);
      if(decode_result.result){
        if(decode_result.decoded && decode_result.decoded.user_id){
          let user = await User.findById(decode_result.decoded.user_id).populate('role_oid').select('nickname phone avatar').lean();
          if(user){
            let expired = user.expired;
            let now_time = moment().format('YYYY-MM-DD HH:mm:ss');
            if(expired && expired < now_time){
              decode_result.message = `user expired`;
            }else{
              user.role = user.role_oid.name;
              user.access = user.role_oid.access;
              user.is_admin = user.role_oid.is_admin;
              delete user.role_oid;
              data.user_info = user;
              verified = true;
            }
          }else{
            decode_result.message = `no authorized user found`;
          }
        }else{
          decode_result.message = `malformed user info`;
        }
      }
    }
    
    if(verified){
      return {result:true};
    }else{
      return {result:false, message:decode_result.message};
    }
  }

  access_check(check_list){
    return async function(ctx, next){
      let user_info = ctx.request.user_info;
      let checked = false;
      let message = "";
      if(user_info){
        let access_fail_msgs = []
        let access = user_info.access;
        let is_admin = user_info.is_admin;
        let power_map = {};
        if(!is_admin){
          access.forEach((user_module)=>{
            power_map[user_module.module] = user_module.power;
          })
          check_list.forEach((module_require)=>{
            let required_module = module_require.module;
            let required_power = module_require.power;
            let user_power = power_map[required_module];
            access_fail_msgs.push(`access '${required_power}' to module '${required_module}'`)
            if(Array.isArray(user_power) && user_power.includes(required_power)){
              checked = true
            }
          })
        }else{
          checked = true
        }
        if(!checked) {
          message = access_fail_msgs.join(' or ') + " is required"
        }
      }else{
        message = `no user_info provided!`
      }

      if(checked){
        await next();
      }else{
        ctx.response.status = 401;
        ctx.response.body = {
          code: 401,
          error: "Access check fail!",
          message,
        };
      }
    }
  }

  generate(payload){
    return jwt.sign(payload, serverConfig.cipher_secret, {expiresIn: '1d'})
  }

  async verify(token){
    try{
      let result = jwt.verify(token, serverConfig.cipher_secret)
      return {
        result: true,
        decoded: result
      }
    }catch(e){
      return {
        result: false,
        message: e.message
      }
    }
  }
}


module.exports  = new JWT()