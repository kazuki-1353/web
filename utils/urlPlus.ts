/*

import urlPlus from '../utils/urlPlus';

let urlObj = urlPlus();

let isLocal = urlObj.isLocal()

*/

export const regLocal = new RegExp(
  /^(?<protocol>\w+:\/\/)?(localhost|(192\.168\.\d+\.\d+)):\d+/,
);

let Plus = class extends URL {
  addQuery = (queries: Record<string, string | number>) => {
    let { searchParams, toString } = this;

    let entries = Object.entries(queries);
    if (entries.length) {
      entries.forEach(([k, v]) => {
        if (v !== undefined) searchParams.set(k, `${v}`);
      });
    }

    return toString();
  };

  deleteQuery = (queries: string[]) => {
    let { searchParams, toString } = this;

    if (queries.length) {
      queries.forEach((i) => {
        searchParams.delete(i);
      });
    }

    return toString();
  };

  clearQuery = () => {
    let { searchParams, toString } = this;

    let queries = searchParams.keys();
    for (let i of queries) {
      searchParams.delete(i);
    }

    return toString();
  };

  /**是否本地开发 */
  isLocal = () => {
    return regLocal.test(this.href);
  };
};

export default (url = window.location.href) => new Plus(url);

/* 测试 */

// let url = new Plus('http://192.168.0.99:10086/pages/h5/index/index');
// console.log(url.isLocal());

/* 测试 */
