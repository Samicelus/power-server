const path = require('path')
const BaseHandler = require(path.join(__dirname,'../../lib/baseSocketHandler.js'));
const handler = new BaseHandler();
const Room = require(path.join(__dirname, '../../models/room.js'));
const User = require(path.join(__dirname, '../../models/user.js'));
const ErrorCode = require(path.join(__dirname, '../../const/error.js'));
const validate = require('../../lib/validate.js').validate;
const Joi = require('@hapi/joi');
const GAMETYPES = require('../../const/gameInfo.js').GAMETYPES;
const RoomClass = require('../../domains/room.js');

const events = require('events');
class EventHandler extends events{}
const eventHandler = new EventHandler();

global.rooms = {};

eventHandler.on('deleteRoom', function(room_id){
    delete global.rooms[room_id];
})

const initRooms = async function(){
    let rooms = await Room.schema.find({creater:{$exists: true}}).lean();
    rooms.forEach((room)=>{
        global.rooms[room._id] = new RoomClass(room, eventHandler);
    });
}

initRooms();

handler.creatRoom = async function(data, socket){
    log(`data:`,data);
    validate({
        room: Joi.string().optional(),
        game_type: Joi.string().valid(GAMETYPES.join(" ")).required(),
        players: Joi.number().min(1).max(8).required()
    }, data.data);
    let user = await User.schema.findById(data.user_id).select('_id username');
    if(!data.data.room){
        data.data.room = `${user.username} 的房间`;
    }
    data.data.creater = socket.id;
    let room = await Room.schema(data.data).save();
    let room_id = room._id.toString();
    global.rooms[room_id] = new RoomClass(room, eventHandler);
    global.rooms[room_id].joinRoom(socket, user);
    return {result: true, room_info: global.rooms[room_id]};
}

handler.listRoom = async function(data, socket){
    log(`data:`,data);
    validate({
        room: Joi.string().optional(),
        game_type: Joi.string().valid(GAMETYPES.join(" ")).optional()
    }, data.data);
    let {room, game_type} = data.data;
    let condition = {};
    if(room){
        condition.room = {$regex: room};
    }
    if(game_type){
        condition.game_type = game_type;
    }
    let rooms = await Room.schema.find(condition).select('room game_type players');
    return {result: true, rooms: rooms};
}

handler.joinRoom = async function(data, socket){
    log(`data:`,data);
    validate({
        room_id: Joi.string().required()
    }, data.data);
    let user = await User.schema.findById(data.user_id).select('_id username');
    let room = global.rooms[data.data.room_id];
    if(room){
        room.joinRoom(socket, user);
    }else{
        let e = new Error(`room not found`);
        e.code = ErrorCode.RoomNotExist;
        throw e;
    }
    return {result: true, room_info: room};
}

module.exports = handler;