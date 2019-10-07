const Koa = require('../koa/application')
const app = new Koa()
app.listen(5050, () => {
  console.log('sever start')
})
