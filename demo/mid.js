function compose(middlewares) {
  if (!Array.isArray(middlewares)) {
    throw new TypeError('Middleware stack must be an array!');
  }

  return function (ctx, next) {
    let index = -1;

    function dispatch(i) {
      if (i < index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      let fn = middlewares[i];

      if (i === middlewares.length) { // 衔接最后一个额外的中间件
        fn = next;
      }

      if (!fn) {
        return Promise.resolve(); // 终止递归
      }

      try {
        return Promise.resolve(fn(ctx, () => {
          return dispatch(i + 1);
        }))
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0)
  }
}

const middlewares = [];
const context = {
  data: []
};

middlewares.push(async (ctx, next) => {
  console.log('action 001');
  ctx.data.push(1);
  await next();
  console.log('action 006');
  ctx.data.push(6);
});

middlewares.push(async (ctx, next) => {
  console.log('action 002');
  ctx.data.push(2);
  await next();
  console.log('action 005');
  ctx.data.push(5);
});

middlewares.push(async (ctx, next) => {
  console.log('action 003');
  ctx.data.push(3);
  await next();
  console.log('action 004');
  ctx.data.push(4);
});

const fn = compose(middlewares);

fn(context)
  .then(() => {
    console.log('end');
    console.log('context = ', context)
  })
