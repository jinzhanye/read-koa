const Koa = require('./koa/application')
const app = new Koa()
app.use(async(ctx, next) => {
  ctx.body = 'hello world'
  next()
})
app.listen(5050, () => {
  console.log('sever start')
})
