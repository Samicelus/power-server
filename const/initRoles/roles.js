module.exports = [
  {
    name: "超级管理员",
    access: [],
    is_admin: true
  },
  {
    name: "操作员",
    access: [
      {
        module: "card",
        power: ["create","modify","delete","view"]
      }
    ],
    default_role: true
  }
]