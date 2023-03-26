/* 

num2money(NUM)

 */
module.exports = (value, floatBit = 2, hasKiloBit) => {
  let r;
  let l;
  let i;
  let t = '';

  if (isNaN(parseFloat(value))) return '0';

  let string = value.toString();
  let posDecimal = string.indexOf('.');
  // 如果为整数
  if (posDecimal < 0) {
    posDecimal = string.length;
    string += '.';
  }
  while (string.length <= posDecimal + floatBit) {
    string += '0';
  }

  // 转换成字符串
  value = string;

  // 转换成整数
  if (floatBit == 0) {
    l = value.split('.')[0].split('').reverse();
    r = value.split('.')[1];

    for (i = 0; i < l.length; i += 1) {
      t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
    }
    return t.split('').reverse().join('');
  }
  // 转换成小数
  floatBit = floatBit > 0 && floatBit <= 20 ? floatBit : 2;
  l = `${parseFloat(`${value}`.replace(/[^\d\.-]/g, '')).toFixed(floatBit)}`;
  l = value.split('.')[0].split('').reverse();
  r = value.split('.')[1];
  for (i = 0; i < l.length; i += 1) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
  }
  return `${t.split('').reverse().join('')}.${r.substring(0, floatBit)}`;
};
