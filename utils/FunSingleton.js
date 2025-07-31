const Singleton = class {
  /** 存储单例实例 */
  static instance;

  /** 获取单例实例的方法 */
  static init() {
    Singleton.instance ||= new Singleton();
    return Singleton.instance;
  }
};

module.exports = Singleton;
