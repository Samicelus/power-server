const BaseModel = require('../lib/baseModel.js');
const model  = new BaseModel();
const GAMETYPES = require('../const/gameInfo').GAMETYPES;

// 房间表
const _Schema = new model.Schema({
    room: {
        type: String,
        required:true
    },
    players: {
        type: Number,
        required: true
    },
    creater: {
        type: String,
        required: true
    },
    game_type: {
        type: String,
        enum: GAMETYPES
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

model.schema =  model.mongoose.model('rooms', _Schema);

module.exports = model;