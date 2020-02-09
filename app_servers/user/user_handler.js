const path = require('path')
const BaseHandler = require(path.join(__dirname,'../../lib/baseSocketHandler.js'));
const handler = new BaseHandler();
const User = require(path.join(__dirname, '../../models/user.js'));
const ErrorCode = require(path.join(__dirname, '../../const/error.js'));
const redisPromise = require('../../lib/redis-promise.js').redisClient;
const auth = require('../../lib/auth.js')(redisPromise);
const serverConfig = require('../../config/serverConfig.json');

handler.signin = async function(data, socket){
    log(`data:`,data);
    const {username, password} = data.data;
    const user = await User.schema({
        username,
        password: auth.computeHash(password, serverConfig.salt)
    }).save();
    let token = await auth.generateToken(user._id.toString(), socket.id); 
    return {result: true, token, user_id: user._id, servers: global.serverInfos};
};

handler.login = async function(data, socket){
    log(`data:`,data);
    const {username, password} = data.data;
    const user = await User.schema.findOne({
        username
    });
    if(!user){
        let e = new Error(`user not found`);
        e.code = ErrorCode.ErrorLogin;
        throw e;
    }
    if(auth.comparePassword(password, user.password)){
        let token = await auth.generateToken(user._id.toString(), socket.id);
        return {result: true, token, user_id: user._id, servers: global.serverInfos};
    }else{
        let e = new Error(`username or password not correct`);
        e.code = ErrorCode.ErrorLogin;
        throw e;
    }
};

handler.test = async function(data, socket){
    return {result: true};
}

module.exports = handler;