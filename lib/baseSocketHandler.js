const path = require('path');
const redisPromise = require('./redis-promise.js').redisClient;
const auth = require('./auth.js')(redisPromise);

class BaseHandler{
    constructor(){
        this.socket_connected = this.socket_connected.bind(this);
        this.rpc_send_message = this.rpc_send_message.bind(this);
    }

    async send_message(user_id, handler_name, data){
        data.handler_name = handler_name;
        await global.socket_handler.send_message(user_id, data);
    }

    check_remote_connection(server_type, server_id){
        return global.socket_handler.check_remote_connection(server_type, server_id);
    }

    async regist_connect(connect_info){
        log(`regist remote user:${connect_info.user_id} socket on ${connect_info.server_id}...`);
        try{
            await global.socket_handler.regist_connect(connect_info);
        }catch(e){
            console.error(e);
        }
    }

    socket_connected(data, socket){
        let connect_info = data.connect_info;
        this.regist_connect(connect_info);
        return {result:true, method:"socket_connected"};
    }

    rpc_send_message(data, socket){
        let to_user_id = data.to_user_id;
        let message = data.message;
        this.send_message(to_user_id, message.handler_name, message);
        return {result:true, method:"rpc_send_message"};
    }

    reconnectAlive(data, socket){
        return {result:true, method:"reconnectAlive"};
    }

    async share_token(data, socket){
        let save_user_id = data.save_user_id;
        let shared_token = data.shared_token;
        await auth.saveToken(save_user_id, shared_token);
        return {result: true, method:"share_token"};
    };

}

module.exports = BaseHandler;