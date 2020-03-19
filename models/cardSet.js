const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();

// 卡组
const _Schema = new model.Schema({
    name: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
        default: Date.now()
    }
}, {versionKey: false});

model.schema =  model.mongoose.model('cardSets', _Schema);

module.exports = model;