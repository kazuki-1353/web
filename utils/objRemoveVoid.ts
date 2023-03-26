/**移除对象中的无效值 */
let removeVoid = (
  data: Record<string, any>,
): Record<string, NonNullable<any>> => {
  if (!data) return {};

  let keys = Object.keys(data);
  return keys.reduce((p, key) => {
    let val = data[key];

    if (val instanceof Array) {
      if (!val.length) return p;
    }

    if (val instanceof Object) {
      if (!Object.keys(val).length) return p;
    }

    /* 移除无效值 */
    switch (val) {
      case undefined:
      case null:
      case '':
        return p;

      default:
        return {
          ...p,
          [key]: val,
        };
    }
  }, {});
};

module.exports = removeVoid;
