module.exports = (...funs) => (arg) => {
  const reduce = funs.reduce((p, v, k) => {
    if (k === 0) {
      return v(p);
    } else if (p === undefined) {
      return;
    } else {
      if (p instanceof Promise) {
        return p.then((res) => {
          if (res !== undefined) return v(res);
        });
      } else {
        return v(p);
      }
    }
  }, arg);

  return reduce;
};
