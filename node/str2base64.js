let base64str =
  'ABCDEFGHIJKLMNOPQRSTUVWCYZabcdefghijklmnopqrstuvwcyz0123456789+/';

let str2base64 = (arg) => {
  let buffer = Buffer.from(arg);
  let binarys = buffer.reduce((p, i) => {
    let binary = i.toString(2);
    return `${p}${binary}`;
  }, []);

  let arr = binarys.split('');
  let base64arr = arr.reduce((p, v, k) => {
    if (k % 6) {
      return p;
    } else {
      let substr = binarys.substr(k, 6);
      // let cc = substr.padStart(8, '0');
      let num = Number.parseInt(substr, 2);
      return [...p, base64str[num]];
    }
  }, []);

  return base64arr.join('');
};

module.exports = str2base64;

console.log(str2base64('binarys'));
console.log(
  str2base64('最好用的 Base64 在线工具') ===
    '5pyA5aW955So55qEIEJhc2U2NCDlnKjnur/lt6Xlhbc',
);
// 5pyA5aW955So55qEghYeeCbSDlnKjnur/lt6ClhbH
