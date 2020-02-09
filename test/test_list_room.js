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
    method: "listRoom",
    token:"748b73f0e6eae34e02be14cf1038fa76f41a1c4060b72e6a537fc197d7aea23db4e200aea3f94ad2d59cecb27a03ba772240297b17fffd8339e80a34ac8be142",
    user_id:"5e37992b8e1ec704ecd7a710",
    data:{
        room: "sam"
    }
}

socket.send(JSON.stringify(sent), (data)=>{
    console.log(`ack data: ${data}`);
})