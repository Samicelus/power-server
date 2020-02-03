const handler_loader = require('./handler_loader.js');
const redisPromise = require('../lib/redis-promise.js').redisClient;
const auth = require('./auth.js')(redisPromise);

class SocketHandler{
    constructor(io){
        this._io = io;
        let loader_ret = new handler_loader(`./app_servers/${process.env.server_type}`);
        log(`[${process.env.server_id}] handlers:`, Object.keys(loader_ret.handlers));
        this._handler = loader_ret.handlers;
        this.connected = {};
    }

    async handle_message(data, socket){
        let handler_name = data.handler_name;
        let method = data.method;
        let rst = await this.call_handler(handler_name, method, data, socket);
        log(rst);
        socket.send({
            user_id: `system:${process.env.server_id||'http'}`,
            data
        });
        log(`send return message to ${socket.id}`);
        return rst;
    }

    async call_handler(hanler_name, method, data, socket){
        return await this._handler[hanler_name][method](data, socket);
    }

    async send_message(user_id, data){
        let connect_info = this.connected[user_id];
        if(connect_info){
            if(connect_info.socket_id){
                return await this._io.to(connect_info.socket_id).send({
                    user_id: user_id,
                    data
                });
            }
        }else{
            console.log(`[connect_info for ${user_id} not found] message not sent...`);
        }
    }

    broadcast(room, data){
        this._io.to(room).send(data);
    }

}


module.exports = SocketHandler;