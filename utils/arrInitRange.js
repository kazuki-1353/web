/* 

// 初始化 0~N 的数组
arrInitRange(NUM)

// 初始化 N1~N2 的数组
arrInitRange(NUM1,NUM2)

// 指定步进值为10
arrInitRange(NUM1,NUM2,10)

*/

/**初始化指定范围的数组 */
module.exports = (first, second, step = 1) => {
  let start;
  let end;

  /* 如果只传入一个参数，代表数组长度 */
  if (second === undefined) {
    start = 0;
    end = first;
  } else {
    start = first;
    end = second;
  }

  const arr = [];
  switch (true) {
    case start < end:
      for (; start < end; start += step) arr.push(start);
      break;

    case start > end:
      for (; start > end; start -= step) arr.push(start);
      break;

    default:
      break;
  }

  return arr;
};
