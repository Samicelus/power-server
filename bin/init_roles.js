const Role = require('../models/role.js');
const User = require('../models/user.js');
const init_roles = require('../const/initRoles/roles.js');
const redisPromise = require('../lib/redis-promise.js').redisClient;
const auth = require('../lib/auth.js')(redisPromise);

async function init(){
  let all_role_names = init_roles.map(item => item.name);
  let updated_role_names = await Role.distinct("name",{"name":{$in:all_role_names}});
  let to_update = init_roles.filter(item => updated_role_names.includes(item.name));
  let to_insert = init_roles.filter(item => !updated_role_names.includes(item.name));
  for(let update_item of to_update){
    await Role.findOneAndUpdate({name:update_item.name},{$set:update_item});
  }
  await Role.insertMany(to_insert);
  let roles = await Role.distinct("name");
  console.log(`init ${roles} success!`);
  let admin = await Role.findOne({is_admin:true});
  if(admin){
    let admin_user = await User.schema.findOne({role_oid: admin._id})
    if(!admin_user){
      admin_user = await User.schema({
        nickname: "超级管理员",
        username: "admin",
        role_oid: admin._id
      }).save()
      admin_user.password = auth.computeHash("admin", auth.generate16salt(admin_user._id))
      await admin_user.save()
      console.log(`init admin with username: 'admin', password: 'admin'`)
    }
  }else{
    console.log(`admin role and user not init, you may have no access to application!`)
  }
}

init();