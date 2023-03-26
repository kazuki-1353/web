/**复制文本
 *
 * @param {(string | HTMLElement)} arg
 * @return {*}  {Promise<string>}
 */
const copy = (arg: string | HTMLElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!arg) throw reject(new Error('缺失参数'));

    let element;
    if (typeof arg === 'string') {
      if (arg[0] === '#') {
        element = document.getElementById(arg.slice(1));
      } else {
        element = document.getElementById(arg);
      }
    } else {
      element = arg;
    }

    if (!element) throw reject(new Error('获取元素异常'));

    let range = document.createRange();
    range.selectNode(element);

    let selObj = document.getSelection();
    if (!selObj) throw reject(new Error('获取剪贴板异常'));

    selObj.removeAllRanges();
    selObj.addRange(range);

    document.execCommand('copy');
    selObj.removeAllRanges();

    resolve(element.innerText);
  });
};

export default copy;
