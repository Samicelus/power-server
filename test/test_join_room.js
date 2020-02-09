const io = require('socket.io-client');
const remoteIP = `127.0.0.1`;
const remotePort = `13021`;

let socket = io(`http://${remoteIP}:${remotePort}`);

socket.on('connect',()=>{
    console.log(`socket connected!`);
})

socket.on('message',(data)=>{
    console.log(`receive data: ${JSON.stringify(data)}`);
    console.log()
})

socket.on('reconnection_login',(data)=>{
    console.log(`please send reconnection_login`);
    console.log('data:',data);
})

let sent = {
    handler_name:"room_handler",
    method: "joinRoom",
    token:"8beeeb33d680c86544a05349cddb93288fac2f276acdf81306099e123df60084026353be24b70cdb3c2c3dfa5207f5874acf5f6e0696b7c387be1ba30218400e",
    user_id:"5e400adfc12b8c2740e03c1a",
    data:{
        room_id: "5e400ee224d3a90bd8e4d637"
    }
}

socket.send(JSON.stringify(sent), (data)=>{
    console.log(`ack data: ${data}`);
})