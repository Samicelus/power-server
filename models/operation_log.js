const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();
const {TYPES} = require('../const/operations/constants');
const moment = require('moment');
moment.locale('zh-cn');

//操作日志表
const _Schema = new model.Schema({
  user_oid:{                    //接口调用者id,仅操作日志记录
    type: model.ObjectId,
    ref: 'users'
  },
  type: {                       //日志类型
    type: String,
    enum: TYPES,
    default: "operate"
  },
  current_role_name:{           //操作时的用户角色
    type: String
  },
  username: {                   //用户名，仅登录日志记录
    type: String
  },
  ip: {                         //登录ip
    type: String
  },
  log:{
    type: String
  },
  created: {type: String},
  updated: {type: String},
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {versionKey: false});

_Schema.post('validate', function(doc){
  if(!doc.created){
    now = moment().format('YYYY-MM-DD HH:mm:ss');
    doc.created = now;
  }
})

_Schema.pre('update', function(){
  let now = moment().format('YYYY-MM-DD HH:mm:ss');
  this._update["$set"].updated = now;
})

module.exports = model.mongoose.model('operation_logs', _Schema);