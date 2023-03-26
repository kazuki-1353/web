/**解析对象的值, 如果为函数则替换为函数结果 */
let objValue = (obj: Record<string, any>): Promise<typeof obj> => {
  let keys = Object.keys(obj);
  let proms = keys.map((k) => {
    let item = obj[k];
    if (typeof item === 'function') {
      return item() as Promise<any>;
    } else {
      return Promise.resolve(item);
    }
  });

  return Promise.all(proms).then((res) => {
    return res.reduce((p, v, k) => {
      let key = keys[k];
      p[key] = v;
      return p;
    }, {});
  });
};

module.exports = objValue;

// let z = {
//   a: 1,
//   b() {
//     return 2;
//   },
//   c() {
//     return new Promise((resolve) => {
//       resolve(3);
//     });
//   },
// };

// module.exports(z).then((res) => {
//   console.log(res);
// });
