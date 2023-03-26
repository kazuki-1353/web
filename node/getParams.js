/**
 * 获取命令行的参数
 * @param prefix 前缀
 */
module.exports = function getParams(prefix = '-') {
  let params = process.argv.slice(2);
  return params.reduce((p, i) => {
    let kv = i.split('=');
    let key = kv[0].replace(prefix, '');
    p[key] = kv[1] || true;
    return p;
  }, {});
};
