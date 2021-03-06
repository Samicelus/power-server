const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();

// 用户表
const _Schema = new model.Schema({
    role_oid: {
        type: model.ObjectId,
        ref: 'roles',
        required: true
    },
    username: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now()
    }
}, {versionKey: false});

model.schema =  model.mongoose.model('users', _Schema);

module.exports = model;