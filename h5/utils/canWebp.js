/**
 * @desc 判断浏览器是否支持webP格式图片
 * @return {Boolean}
 */
export default () => {
  let canvas = document.createElement('canvas');
  let webp = canvas.toDataURL('image/webp');
  let isSupport = webp.indexOf('data:image/webp') === 0;
  return isSupport;
};
