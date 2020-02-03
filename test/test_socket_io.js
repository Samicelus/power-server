const io = require('socket.io-client');
const remoteIP = `127.0.0.1`;
const remotePort = `13020`;

let socket = io(`http://${remoteIP}:${remotePort}`);

socket.on('connect',()=>{
    console.log(`socket connected!`);
    // let sent = {
    //     user_id:"system",
    //     handler_name:"notice_handler",
    //     method: "join_room",
    //     data:{
    //         user_id: "system"
    //     }
    // }
    // socket.send(JSON.stringify(sent), (data)=>{
    //     console.log(`ack data: ${data}`);
    // })
})

socket.on('message',(data)=>{
    console.log(`receive data: ${JSON.stringify(data)}`);
})

socket.on('reconnection_login',(data)=>{
    console.log(`please send reconnection_login`);
    console.log('data:',data);
})

let sent = {
    handler_name:"user_handler",
    method: "login",
    data:{
        username: "sam",
        password: "123456"
    }
}
socket.send(JSON.stringify(sent), (data)=>{
    console.log(`ack data: ${data}`);
})