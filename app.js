const path = require('path');
const util = require('util');
const SocketHandler = require(path.join(process.cwd(),'/lib/socket.io_handler.js'));
const ErrorCode = require(path.join(process.cwd(),'/const/error.js'))


global.workers = {};
global.log = function(){
    process.stdout.write(`\x1B[42m[${process.env.server_id}]\x1B[49m `);
    for(let i in arguments){
        switch(typeof arguments[i]){
            case "number":
                process.stdout.write(`\x1B[36m${arguments[i].toString()}\x1b[0m`);
                process.stdout.write(" ");
                break;
            case "object":
                process.stdout.write(`\x1B[33m${JSON.stringify(util.inspect(arguments[i]))}\x1b[0m`);
                process.stdout.write(" ");
                break;
            case "function":
                process.stdout.write(`\x1B[90m${arguments[i].toString()}\x1B[39m`);
                process.stdout.write(" ");
                break;
            default:
                process.stdout.write(`\x1B[37m${arguments[i]}\x1B[39m`);
                process.stdout.write(" ");
                break;
        }
    }
    process.stdout.write("\n");
}

let port = process.env.port;
let io = require('socket.io')(port);
global.socket_handler = new SocketHandler(io);
io.on('connect',(socket)=>{
    log(`client with id [${socket.id}] connects to server`);
    socket.emit("reconnection_login",{});
    socket.on('message',async (data_str)=>{
        log(`receive message from ${socket.id}:`,data_str);
        let data = {};
        let handler_name, method;
        try{
            data = JSON.parse(data_str);
            handler_name = data.handler_name;
            method = data.method;
        }catch(e){
            socket.send({
                type: `error`,
                code: ErrorCode.ParseError,
                message: `can't parse data`
            });
        }

        try{
            const rst = await global.socket_handler.handle_message(data, socket);
            socket.send({
                type: `return`,
                result: rst,
                handler_name,
                method
            });
        }catch(e){
            console.error(e);
            socket.send({
                type: `error`,
                code: ErrorCode[e.code],
                message: e.message,
                handler_name,
                method
            });
        }
    })
});

//report to userServer
if(process.env.server_type !== "user"){
    const io_cli = require('socket.io-client');
    const remoteIP = `localhost`;
    const remotePort = `13020`;
    
    let socket = io_cli(`http://${remoteIP}:${remotePort}`);
}else{

}



module.exports = io;