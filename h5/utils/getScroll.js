/* 获取滚动位置 */
export default (el = window) => {
  if (window.pageXOffset === undefined) {
    // 兼容 IE8
    const { documentElement, body } = window.document;
    const dom = el === window ? documentElement || body.parentNode || body : el;

    return {
      x: dom.scrollLeft,
      y: dom.scrollTop,
    };
  }

  return {
    x: el.pageXOffset,
    y: el.pageYOffset,
  };
};
