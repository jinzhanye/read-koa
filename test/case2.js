const Koa = require('../koa/application')

const app = new Koa();
app.use(ctx=>{
  // 实质上是node的原生req、res
  console.log('ctx.req.url:', ctx.req.url);
  console.log('ctx.request.url:',ctx.request.url)
  console.log('ctx.request.req.url:', ctx.request.req.url)

  console.log('ctx.request.path:', ctx.request.path)
})
app.listen(5050, () => {
  console.log('sever start')
})
