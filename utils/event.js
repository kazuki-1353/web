const Event = class {
  /**订阅者集合 */
  clientList = {};

  /**
   * 订阅方法
   * @param {*} key 订阅者名称
   * @param {*} fun 回调函数
   */
  listen(key, fun) {
    const { clientList } = this;
    const funs = clientList[key];
    if (funs) {
      // 添加订阅方法
      funs.push(fun);
    } else {
      // 没有订阅者时初始化空数组
      clientList[key] = [fun];
    }
  }

  /**
   * 通知订阅者
   */
  trigger(key, ...arg) {
    const funs = this.clientList[key];

    // 没有订阅者
    if (!funs) return;

    // 执行订阅者的所有方法
    funs.forEach((fun) => fun(...arg));
  }

  /**
   * 取消订阅
   * @param {*} key
   * @param {*} fun
   */
  remove(key, fun) {
    const funs = this.clientList[key];

    // 没有订阅者
    if (!funs) return;

    if (fun) {
      // 清掉该方法
      const index = funs.findIndex((i) => i === fun);
      if (~index) funs.splice(index, 1);
    } else {
      // 全部清空
      funs.length = 0;
    }
  }
};

module.exports = new Event();
