const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const EventEmitter = require('events')

module.exports = class extends EventEmitter {
  constructor() {
    super()
    this.fn = null
    // 继承
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
    this.middlewares = []
  }

  listen() {
    const server = http.createServer(this.callbacks.bind(this))
    server.listen(...arguments)
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  compose(ctx) {
    let index = 0
    const dispatch = () => {
      // 终止递归
      if (index === this.middlewares.length) return Promise.resolve()
      let middleware = this.middlewares[index++]
      // 防止 callback 返回的不是 Promise，统一进行 Promise 包裹
      return Promise.resolve(middleware(ctx, () => dispatch()))
    }
    return dispatch()
  }

  callbacks(req, res) {
    const ctx = this.createContext(req, res)
    this.compose(ctx).then(() => {
      const _body = ctx.body
      if (typeof _body === 'string' || Buffer.isBuffer(_body)) { // Buffer 是全局对象
        res.end(_body) // res.end 只支持 String 和 Buffer
      } else if (typeof _body === 'number') {
        return res.end(String(_body))
      } else if (_body instanceof Stream) {
        _body.pipe(res) // 将结果通过管道写入到 res
        return
      } else if (typeof _body === 'object') {
        return res.end(JSON.stringify(_body));
      }

      return res.end('unknow data type')
    }).catch(err => {
      this.emit('error', err)
    })
  }

  createContext(req, res) {
    const ctx = this.context
    ctx.request = this.request
    ctx.response = this.response
    ctx.request.req = ctx.req = req
    ctx.response.res = ctx.res = res

    return ctx
  }
}
