
const crypto = require('crypto');
const cipher_secret = require(process.cwd()+'/config/serverConfig.json').cipher_secret;

class auth{
    constructor(redis){
        this.redis = redis;
        this.comparePassword = this.comparePassword.bind(this);
        this.computeHash = this.computeHash.bind(this);
        this.generateToken = this.generateToken.bind(this);
        this.checkToken = this.checkToken.bind(this);
    }

    generate16salt(user_id){
        const nowTimestamp = new Date().getTime();
        return crypto.createHash('md5').update(user_id+nowTimestamp).digest('hex').slice(0, 16);
    }

    computeHash(password, salt) {
        return `|SHA|${salt}|${sha256(sha256(password) + salt)}`;
    };

    comparePassword(password, hashedPassword){
        console.log(`compare: ${password} ${hashedPassword}`)
        let hash = getHash(hashedPassword);
        let salt = getSalt(hashedPassword);
        let hashed = getHash(this.computeHash(password, salt));
        return hash == hashed;
    }

    async checkToken(user_id, token){
        let key = "auth:token";
        let stored_token = await this.redis.hgetAsync(key, user_id);
        if(!stored_token||token!=stored_token){
            return {result:false};
        }
        return {result:true};
    }

    async generateToken(user_id, ip){
        let nowTimestamp = new Date().getTime();
        let origin_str = `${user_id}|${nowTimestamp}|${ip}`;
        let token = encrypt_token(origin_str);
        let key = "auth:token";
        await this.redis.hsetAsync(key, user_id.toString(), token);
        return token;
    }

    async delete_user_token(user_id){
        let key = "auth:token";
        return await this.redis.hdelAsync(key, user_id);
    }

    async testPWD(str){
        return testPWD(str);
    }


    async authToken(ctx, next){
        let token = ctx.request.header['b-token'];
        let user_id = ctx.request.header['b-user-id'];
        let ret = await this.checkToken(user_id, token);
        if (!ret.result) {
            throw new Error(`token 校验失败，请重新登录`);
        }else{
            ctx.request.body.userInfo = {
                user_id: user_id
            };
        }
        return next();
    }
};

function getHash(hashedPassword){
    return hashedPassword.split("|")[3];
};

function getSalt(hashedPassword){
    return hashedPassword.split("|")[2];
};

function sha256(str){
    return  crypto.createHash('sha256').update(str).digest('hex');
}

function encrypt_token(str){
    let cipher = crypto.createCipher('aes192', cipher_secret);
    let encrypted = cipher.update(str,'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function testPWD(pwd){
    "use strict";
    let err_msg = "";
    if(!/[a-z]/.test(pwd)){
        err_msg += "no lower case letter!";
    }
    if(!/[A-Z]/.test(pwd)){
        err_msg += "no upper case letter!";
    }
    if(!/[0-9]/.test(pwd)){
        err_msg += "no number!";
    }
    if(!/\W/.test(pwd)){
        err_msg += "need a special letter!";
    }
    if(pwd.length<6||pwd.length>20){
        err_msg += "pwd length must between 6 and 20";
    }

    if(err_msg){
        return {result:false, err_msg:err_msg};
    }else{
        return {result:true};
    }
}



module.exports = function(redis){
    return new auth(redis);
}