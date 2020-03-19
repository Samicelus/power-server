const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
moment.locales('zh-cn');
const CardSet = require(path.join(__dirname, '../models/cardSet.js'));
const Card = require(path.join(__dirname, '../models/card.js'));
const BaseHandler = require(path.join(__dirname, '../lib/baseHandler.js'));
let handlers = new BaseHandler();

handlers.listCardSet = async function(ctx, next){
  let query = ctx.query;
  let {name, page=1, pageSize=10} = query;
  
  let condition = {};
  if(name){
    condition.name = {"$regex": name};
  }
  let list = await CardSet.schema.find(condition)
  .select(`_id name description`)
  .sort({"created":-1})
  .skip((Number(page)-1)*Number(pageSize))
  .limit(Number(pageSize))
  .lean();

  let count = await CardSet.schema.count(condition);

  for(let item of list){
    item.count = await Card.schema.count({set_oid: item._id});
  }

  return handlers.restSuccess(ctx, {list, page, pageSize, count});
};

handlers.addCardSet = async function(ctx, next){
  let body = ctx.request.body;
  let {name, description} = body;

  let cardSet = await CardSet.schema({
    name,
    description
  }).save();

  return handlers.restSuccess(ctx, cardSet);
};

handlers.listCards = async function(ctx, next){
  let query = ctx.query;
  let {set_id, page=1, pageSize=10} = query;
  
  let condition = {
    set_oid: mongoose.Types.ObjectId(set_id)
  };

  let list = await Card.schema.find(condition)
  .select(`_id order plantType consume produce`)
  .sort({"created":-1})
  .skip((Number(page)-1)*Number(pageSize))
  .limit(Number(pageSize))
  .lean();

  let count = await Card.schema.count(condition);

  let cardSet = await CardSet.schema.findById(set_id);

  return handlers.restSuccess(ctx, {list, page, pageSize, count, cardSet});
};

handlers.addCard = async function(ctx, next){
  let body = ctx.request.body;
  let {set_id, order, plantType, consume, produce} = body;

  let cardSet = await CardSet.schema.findById(set_id);

  if(!cardSet){
    throw new Error(`no set found!`);
  }

  let duplicated = await Card.schema.findOne({
    set_oid: mongoose.Types.ObjectId(set_id),
    order
  });

  if(duplicated){
    throw new Error(`duplicated card order ${order} found in the set!`);
  }

  let card = await Card.schema({
    set_oid: mongoose.Types.ObjectId(set_id),
    order,
    plantType,
    consume,
    produce
  }).save();

  return handlers.restSuccess(ctx, card);
};

handlers.editCard = async function(ctx, next){
  let body = ctx.request.body;
  let {card_id, order, plantType, consume, produce} = body;

  let current = await Card.schema.findById(card_id);
  if(!current){
    throw new Error(`card not found!`);
  }
  let set_oid = current.set_oid;
  let current_order = current.order;

  if(order){
    let duplicated = await Card.schema.findOne({
      set_oid,
      order
    });

    if(duplicated && order!=current_order){
      throw new Error(`duplicated card order ${order} found in the set!`);
    }
    current.order = order;
  }

  if(plantType){
    current.plantType = plantType;
  }

  if(consume){
    current.consume = consume;
  }

  if(produce){
    current.produce = produce;
  }
  
  let card = await current.save();

  return handlers.restSuccess(ctx, card);
};

handlers.getCardDetail = async function(ctx, next){
  let query = ctx.query;
  let {card_id} = query;
  
  let card = await Card.schema.findById(card_id);

  return handlers.restSuccess(ctx, card);
};

module.exports = handlers;