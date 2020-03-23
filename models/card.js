const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();
const PLANTTYPES = require('../const/gameInfo').PLANTTYPES;

const path = require('path');
const CardSet = require(path.join(__dirname, './cardSet.js'));

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

_Schema.post('save',async function(doc, next){
    let set_oid = doc.set_oid;
    let count = await model.schema.count({set_oid});
    await CardSet.schema.findByIdAndUpdate(set_oid, {$set:{count}});
    next();
})

_Schema.post('findOneAndRemove',async function(doc, next){
    if(doc){
        let set_oid = doc.set_oid;
        let count = await model.schema.count({set_oid});
        await CardSet.schema.findByIdAndUpdate(set_oid, {$set:{count}});
    }
    next();
})

model.schema =  model.mongoose.model('cards', _Schema);

module.exports = model;