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
    console.log()
})

socket.on('reconnection_login',(data)=>{
    console.log(`please send reconnection_login`);
    console.log('data:',data);
})

let sent = {
    handler_name:"user_handler",
    method: "test",
    token:"748b73f0e6eae34e02be14cf1038fa763142488388417a153b62c11d0f69921d80eaa296b299f447349a97e353f3d373268342743c0f25241c22f195892fb526",
    user_id:"5e37992b8e1ec704ecd7a710",
    data:{
        username: "sam",
        password: "123456"
    }
}
socket.send(JSON.stringify(sent), (data)=>{
    console.log(`ack data: ${data}`);
})