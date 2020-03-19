const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();
const PLANTTYPES = require('../const/gameInfo').PLANTTYPES;

// 卡牌
const _Schema = new model.Schema({
    set_oid: {
        type: model.ObjectId,
        ref: 'cardSets',
        required: true
    },
    order: {
        type: Number,
        min: 0,
        required:true
    },
    plantType: {
        type: String,
        enum: PLANTTYPES,
        required: true
    },
    consume: {
        type: Number,
        default: 0
    },
    produce: {
        type: Number,
        min: 1
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

model.schema =  model.mongoose.model('cards', _Schema);

module.exports = model;