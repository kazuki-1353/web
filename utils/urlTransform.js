/**
 * 对象转为查询字串
 * @param {object} obj
 * @param {boolean} isURI 是否对所有非标准字符进行编码
 * @returns string
 */
export function obj2search(obj, isURI) {
  if (obj) {
    if (typeof obj === 'string') {
      return `?${obj}`;
    } else {
      const keys = Object.keys(obj);

      /** 获取名值对数组 */
      const querys = keys.reduce((p, key) => {
        let val = obj[key];

        // 过滤空值
        if (val === undefined || val === '') {
          return p;
        } else {
          switch (val.constructor) {
            case Array:
            case Object:
              val = JSON.stringify(val);
              break;

            default:
              break;
          }
        }

        let item = '';

        // 是否对所有非标准字符进行编码
        if (isURI) {
          item = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
        } else {
          item = `${key}=${val}`;
        }

        return [...p, item];
      }, []);

      /** 合并生成查询字串 */
      if (querys.length) return `?${querys.join('&')}`;
    }
  }

  return '';
}

/**
 * 查询字串转为对象
 * @param {string} search
 * @returns {object}
 */
export function search2obj(search = window.location.search) {
  if (!search) return {};

  let split = search.split('?');
  let querys = split[1] || split[0];

  let arr = querys.split('&'); //分割参数
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
}

/**
 * 链接转为对象
 * @param {string} url
 * @returns {object}
 */
export function url2obj(url = window.location.href) {
  let obj = {};

  if (typeof window === 'undefined') {
    let exec =
      /(?<origin>((?<protocol>\w+:)\/\/)?(?<host>(?<hostname>\w+\.\w+)?(:(?<port>\d+))?))(?<pathname>\/[^?]+)?(?<search>\?[^#]+)?(?<hash>#\w+)?/.exec(
        url,
      );

    let { groups } = exec;
    obj = {
      ...groups,
      searchParams: search2obj(groups.search),
    };
  } else {
    obj = window.location;
  }

  return obj;
}
