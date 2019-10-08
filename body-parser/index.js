const Koa = require('koa')
const app = new Koa()

// koa 是没有 ctx.request.body 的，ctx.request.body 是 bodyParser 添加的属性

const bodyParser = () => {
  return async (ctx, next) => { // 返回一个async函数
    await new Promise((resolve, reject) => {
      let arr = [];
      // on data 官方指南 https://nodejs.org/zh-cn/docs/guides/anatomy-of-an-http-transaction/
      ctx.req.on('data', (chunk) => { // 原生 req 对象监听
        arr.push(chunk);
      })
      ctx.req.on('end', () => {
        ctx.request.body = Buffer.concat(arr).toString(); // 将文件流赋值给 ctx.request.body
        resolve();
      })
    })
    await next();
  }
}


app.use(bodyParser()) // 挂载中间件 koa-bodyparser
app.use(async (ctx, next) => { // 渲染一个表单，表单提交时候请求接口 /login
  if (ctx.method === "GET" && ctx.path === "/form") {
    ctx.body = `
            <form action="/login" method="post">
                <input type="text" name="username"/>
                <input type="text" name="password"/>
                <button>提交</button>
            </form>
        `;
  } else {
    await next();
  }
});

app.use(async ctx => {
  if (ctx.method === "POST" && ctx.path === "/login") {
    ctx.body = ctx.request.body; //将接口得到的数据展示在页面上
  }
});

app.listen(5050);
