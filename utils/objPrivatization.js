/* 

禁止访问以 _ 开头的属性

*/

module.exports = (obj) => {
  return new Proxy(obj, {
    /** 拦截读取操作 */
    get(...args) {
      if (prop.startsWith('_')) throw new Error('Access denied');

      const value = Reflect.get(...args);
      const isFun = typeof value === 'function';

      /* 为了使函数能够访问私有属性, 必须将对象方法的上下文绑定到原始对象 */
      return isFun ? value.bind(args[0]) : value;
    },

    /** 拦截写入操作 */
    set(...args) {
      if (prop.startsWith('_')) throw new Error('Access denied');

      return Reflect.set(...args);
    },

    /** 拦截属性删除 */
    deleteProperty(...args) {
      if (prop.startsWith('_')) throw new Error('Access denied');

      return Reflect.deleteProperty(...args);
    },

    /** 拦截读取属性列表 */
    ownKeys(target) {
      const keys = Object.keys(target);
      const filter = keys.filter((key) => !key.startsWith('_'));
      return filter;
    },
  });
};
