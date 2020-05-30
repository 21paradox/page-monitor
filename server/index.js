const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
// const Router = require('koa-router');
const Logger = require('koa-logger');
const serve = require('koa-static');
const mount = require('koa-mount');
const cors = require('koa-cors');
const HttpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const RestQL = require('koa-restql');
const { sequelize } = require('./models//index');

const app = new Koa();

// These are the new change
const staticPage = new Koa();
staticPage.use(
  serve(path.resolve(__dirname, '../public')),
);
// serve the build directory
app.use(mount('/static', staticPage));

app.use(BodyParser());
app.use(Logger());
app.use(cors());

const sqlPage = new Koa();
const restql = new RestQL(sequelize.models);
sqlPage.use(restql.routes());
sqlPage.use(() => {});
app.use(mount('/api-restql', sqlPage));

// const router = new Router();
// app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx) => {
  ctx.status = HttpStatus.OK;
  ctx.set('Content-Type', 'text/html');
  ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);

  require('./cron/index').init()
});
