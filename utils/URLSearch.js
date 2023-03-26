/* 获取查询参数

import URLSearch from '../utils/URLSearch';
let URLSearch = require('../utils/URLSearch');

let params = new URLSearch(); // 默认为完整链接
let params = new URLSearch('http://host?a=1&b=2'); // 传入完整链接
let params = new URLSearch('?a=1&b=2'); // 传入查询字串
params.get('a')
params.set('c', 3)
params.toString() // 查询字串
params.toURLString() // 完整链接
params.url // 不带查询字串的链接

*/

const URLSearch = class {
  constructor(arg = window.location.href) {
    this.params = this.query2obj(arg);
  }

  /**当前查询对象 */ params = {};
  /**原始查询字串 */ query = null;
  /**不带查询字串的地址 */ url = null;

  query2obj(arg) {
    if (!arg) return {};

    let hasSearch = arg.includes('?');
    if (hasSearch) {
      let split = arg.split('?');
      this.query = split[0];

      // 如果传入的是完整链接
      if (split.length === 2) {
        this.url = split[0];
        this.query = split[1];
      }

      let arr = this.query.split('&'); //分割参数
      let obj = arr.reduce((p, i) => {
        let [k, v] = i.split('='); //分割键值对
        let val = decodeURIComponent(v); //解码

        // 判断是否重复
        let repeat = p[k];
        if (repeat) {
          let vals = Array.isArray(repeat) ? repeat : [repeat];
          val = [...vals, val];
        }

        return {
          ...p,
          [k]: val,
        };
      }, {});

      return obj;
    } else {
      this.query = '';
      this.url = arg;
      return {};
    }
  }

  /**序列化 */
  toString(isSort) {
    let keys = Object.keys(this.params);
    if (!keys.length) return '';

    let arr = isSort ? keys.sort() : keys; // 是否排序
    let params = arr.reduce((p, key) => {
      let val = this.params[key];
      // 判断是否数组
      if (Array.isArray(val)) {
        let sub = val.map((i) => `${key}=${encodeURIComponent(i)}`);
        let next = [...p, ...sub];
        return next;
      }

      let next = [...p, `${key}=${encodeURIComponent(val)}`];
      return next;
    }, []);

    let str = params.join('&');
    return `?${str}`;
  }
  toURLString() {
    let { url } = this;
    let query = this.toString();
    return `${url || ''}${query}`;
  }
  has(key) {
    return Object.prototype.hasOwnProperty.call(this.params, key);
  }
  set(key, val) {
    this.params[key] = val;
    return this.getAll();
  }
  get(key) {
    return this.params[key] || null;
  }
  getAll() {
    return this.params;
  }
  delete(key) {
    delete this.params[key];
    return this.getAll();
  }
  keys() {
    return Object.keys(this.params);
  }
  values() {
    return Object.values(this.params);
  }
  entries() {
    return Object.entries(this.params);
  }
};

module.exports = URLSearch;
