const Joi = require('@hapi/joi');
const ErrorCode = require('../const/error.js');

class VALIDATE{
  constructor(){
    this.validate = this.validate.bind(this)
  }
  validate(validate, data){
    let schema = Joi.object(validate);
    let result = schema.validate(data);
    if(result && result.error){
      let e = new Error(result.error.message);
      e.code = ErrorCode.ErrorValidate
      throw e;
    }
  }
}

module.exports = new VALIDATE()
