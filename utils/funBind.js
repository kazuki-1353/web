let bind = function (that, ...args) {
  // 判断是否为函数调用
  if (
    typeof target !== 'function' ||
    Object.prototype.toString.call(target) !== '[object Function]'
  ) {
    throw new TypeError(this + ' must be a function');
  }

  let self = this;
  let bound = function (...args2) {
    let finalArgs = [...args, ...args2];

    // 检测是否是被 new 调用
    if (new.target !== undefined) {
      let result = self.apply(this, finalArgs);
      if (result instanceof Object) {
        return result;
      } else {
        return this;
      }
    } else {
      return self.apply(that, finalArgs);
    }
  };

  if (self.prototype) {
    // 为什么使用了 Object.create? 因为我们要防止，bound.prototype 的修改而导致self.prototype 被修改。不要写成 bound.prototype = self.prototype; 这样可能会导致原函数的原型被修改。
    bound.prototype = Object.create(self.prototype);
    bound.prototype.constructor = self;
  }

  return bound;
};

module.exports = bind;
