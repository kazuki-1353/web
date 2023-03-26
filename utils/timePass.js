/**
 * @desc   格式化 t 距现在的已过时间
 * @param  {Number} t
 * @return {String}
 */
module.exports = (t) => {
  const time = Date.now() - t;

  const m = parseInt(time / 60000, 10);
  const h = parseInt(m / 60, 10);
  const D = parseInt(h / 24, 10);
  const M = parseInt(D / 30, 10);
  const Y = parseInt(M / 12, 10);

  if (Y) return `${Y}年前`;
  if (M) return `${M}个月前`;
  if (D) return `${D}天前`;
  if (h) return `${h}小时前`;
  if (m) return `${m}分钟前`;

  return '刚刚';
};
