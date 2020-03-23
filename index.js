const Koa = require('koa');
const os = require('os');
const app = new Koa();
app.proxy = true;
const path = require('path');
const compose = require('koa-compose');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('koa-cors');
const main = serve(path.join(__dirname,'/public'));

const swagger_host = "localhost:12133";

global.swaggerSpec = {
  "swagger": "2.0",
  "info": {
    "description": "power-server 项目 http 接口文档",
    "version": "1.0.0",
    "title": "Power Server",
    "contact": {
      "email": "50893818@qq.com"
    }
  },
  "host": swagger_host,
  "basePath": "/",
  "tags":[],
  "schemes": ["http"],
  "paths":{}
};

const {MODULEMAP} = require('./const/modules/constants');

for(let key in MODULEMAP){
  global.swaggerSpec.tags.push({
    name: key,
    description: MODULEMAP[key]
  })
}

const koaSwagger = require('koa2-swagger-ui');

let swagger = async function(ctx, next){
  await next();
};

if(process.env.NODE_ENV != "production"){
  swagger = koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      spec: global.swaggerSpec
    },
  });
  console.log(`swagger ui available on http://${swagger_host}/swagger`);
}




const moment = require('moment');
moment.locale('zh-cn');
const JWT = require('./lib/jwt.js');
const serverConfig = require(`./config/serverConfig.json`);
process.env.server_id = 'http';

const errorHandler = require('./lib/errorHandler');

const logger = async (ctx, next) => {
    process.stdout.write(`\x1B[42m[${moment().format('YYYY-MM-DD HH:mm:ss')} ${ctx.request.method.toUpperCase()}]\x1B[49m `);
    process.stdout.write(`\x1B[36m${ctx.request.url}\x1b[0m`);
    process.stdout.write(`\x1B[33m header:${JSON.stringify(ctx.request.header)}\x1b[0m`);
    process.stdout.write(`\x1B[90m body: ${JSON.stringify(ctx.request.body)}\x1B[39m`);
    console.log();
    await next();
}

const notFound = async (ctx, next) =>{
    ctx.response.status = 404;
    ctx.response.body = {
      code: 404,
      error:'Not Found'
    };
}

app.use(cors());

const pre_middlewares = compose([errorHandler, main, swagger, koaBody({
  multipart: true,
  uploadDir: os.tmpdir()
}), logger, JWT.auth]);
app.use(pre_middlewares);

const router = require('./lib/router.js');
router(app);

const post_middlewares = compose([notFound]);
app.use(post_middlewares);

app.on('error',(err, ctx)=>{
  console.log('server error', err);
  console.error('server error', err);
})

app.listen(process.env.port||12133);
