class Layer {
  constructor(method, pathname, callback) {
    this.method = method;
    this.pathname = pathname;
    this.callback = callback;
  }

  match(path, method) {
    return path === this.pathname && method.toLowerCase() === this.method
  }
}

class Router {
  constructor() {
    this.stack = [];
  }

  get(pathname, callback) {
    const layer = new Layer('get', pathname, callback);
    this.stack.push(layer)
  }

  compose(fns, ctx, next) {
    const dispatch = (index) => {
      if(index === fns.length){
        return next();
      }
      const callback = fns[index].callback;
      return Promise.resolve(callback(ctx, () => dispatch(index + 1)))
    }

    return dispatch(0);
  }

  routes() {
    return async (ctx, next) => {
      const { path, method } = ctx;
      const fns = this.stack.filter(layer => layer.match(path, method))
      this.compose(fns, ctx, next)
    }
  }
}

module.exports = Router
