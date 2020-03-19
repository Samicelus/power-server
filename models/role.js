const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();
const {MODULES, POWERS} = require('../const/modules/constants');
const moment = require('moment');
moment.locale('zh-cn');

// 角色表
const _Schema = new model.Schema({
	name: {
	  type: String,
    unique: true
  },
  access: [{
	  module: {
	    type: String,
      enum: MODULES
    },
    power: [{
	    type: String,
      enum: POWERS
    }]
  }],
  is_admin: {
	  type: Boolean,
    default: false
  },
  default_role: {
	  type: Boolean,
    default: false
  },
  created:{type: String},
  updated:{type: String}
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

module.exports = model.mongoose.model('roles', _Schema);