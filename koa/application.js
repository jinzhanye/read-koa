const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

module.exports = class {
  constructor() {
    this.fn = null
    // 继承
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }
  listen() {
    const server = http.createServer(this.callbacks.bind(this))
    server.listen(...arguments)
  }
  use(middleware) {
    this.fn = middleware
  }
  callbacks(req, res) {
    const ctx = this.createContext(req, res)
    this.fn(ctx)
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
