const path = require('path')
const BaseHandler = require(path.join(__dirname,'../../lib/baseSocketHandler.js'));
const handler = new BaseHandler();

module.exports = handler;