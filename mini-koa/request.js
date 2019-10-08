const url = require('url')

const request = {
  get url() {
    return this.req.url
  },
  get path() { // 原生的 req 属性中没有 path 属性
    return url.parse(this.req.url).pathname
  }
}

module.exports = request
