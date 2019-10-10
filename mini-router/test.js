const Koa = require('koa');
const Router = require('./index');
const router = new Router();
const app = new Koa();
router.get('/hello',async (ctx,next)=>{
  ctx.body = 'hello';
  next();
})

router.get('/hello',async (ctx,next)=>{
  ctx.body = 'world';
  next();
})

app.use(router.routes());
app.listen(5050);
