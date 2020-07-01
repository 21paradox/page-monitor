const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');
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

const apiApp = new Koa();

const sqlPage = new Koa();
const restql = new RestQL(sequelize.models);
sqlPage.use(restql.routes());
sqlPage.use(() => {});

const router = new Router();
router.all('/queryRaw', async (ctx) => {
  console.log(ctx.request.body)

  const sqlQuery = `
  select 
    count(CASE WHEN allTime >= 500 THEN 1 END) as time_le_500,
    count(CASE WHEN allTime >= 200 AND allTIme < 500 THEN 1 END) as time_200_500,
    count(CASE WHEN allTime >= 100 AND allTIme < 200 THEN 1 END) as time_100_200,
    count(CASE WHEN allTime < 100 THEN 1 END) as time_lt_100,
    count(allTime) as allTimeCount,
    avg(allTime), pageId, roundId , runningAt
    from performances 
    left join rounds on performances.roundId = rounds.id
    where pageId = 1 
      group by roundId order by roundId desc  limit 5 offset 0;
  `

  const [results, metadata] = await sequelize.query(ctx.request.body.sqlQuery);
  ctx.body = {
    results,
    // metadata
  }
  ctx.set('Content-Type', 'application/json');
  ctx.status = HttpStatus.OK;
})

apiApp.use(router.routes()).use(router.allowedMethods());
apiApp.use(mount('/restql', sqlPage));

app.use(mount('/api', apiApp))
app.use(async (ctx) => {
  ctx.status = HttpStatus.OK;
  ctx.set('Content-Type', 'text/html');
  ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);
  // require('./cron/index').init()
});
