const MODULES = [
  "log-manage",
  "card",                    //卡牌管理
  "system|user",                //用户管理
]

const MODULEMAP = {
  "log-manage": "日志管理",
  "card": "卡牌管理",                      //卡牌管理
  "system|user": "用户管理",                //用户管理
}

const POWERS = [
  "create",
  "modify",
  "delete",
  "view"
]

module.exports = {
  MODULES,
  MODULEMAP,
  POWERS
}