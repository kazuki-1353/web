module.exports = function* initializer(count, fun = (i) => i) {
  for (let i = 0; i < count; i += 1) {
    if (fun.constructor.name === 'GeneratorFunction') {
      yield* fun(i, count);
    } else {
      yield fun(i, count);
    }
  }
};
