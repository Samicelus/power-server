const Room = require('../models/room.js');
const event = require('events');

class RoomClass{
    constructor(room, eventHandler){
        this.eventHandler = eventHandler;
        this.id = room._id;
        this.room = room.room;
        this.creater = room.creater;
        this.game_type = room.game_type;
        this.players = room.players;
        this.members = [];
        this.timestamp = new Date().getTime();
        this.joinRoom = this.joinRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);

        let that = this;
        let socket = global.socket_handler._io.sockets.clients().sockets[this.creater];

        let timer = setInterval(async ()=>{
            if(!socket || !socket.connected){
                await that.deleteRoom();
                clearInterval(timer);
            }
        }, 1000);
    }

    joinRoom(socket, user){
        socket.join(this.id);
        this.members.push(user);
    }

    async deleteRoom(){
        await Room.schema.findByIdAndRemove(this.id);
        global.socket_handler._io.to(this.id).send(JSON.stringify({
            type: 'system',
            event: 'roomDeleted',
            room_id: this.id,
            message: `你从房间 ${this.room} 退出`
        }))
        this.eventHandler.emit('deleteRoom', this.id);
    }
}

module.exports = RoomClass;
