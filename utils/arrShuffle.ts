/* 数组洗牌

arrShuffle(ARR)

*/
let arrShuffle = <T = any>(arr: T[]): T[] => {
  let length = arr.length;

  let res = [...arr];
  for (let i = 0; i < length; i++) {
    // 生成一个 [i, length] 区间内的随机数
    let random = Math.floor(Math.random() * length);

    // 交换位置
    [res[random], res[i]] = [res[i], res[random]];
  }

  return res;
};

export default arrShuffle;

/* 测试 */
// {
//   let arr = Array.from({ length: 100 }, (v, k) => k);

//   let aa = arrShuffle(arr);
//   console.log(aa);
// }
// {
//   let arr = Array.from({ length: 100 }, (v, k) => k);

//   // 记录每个元素被选中的次数
//   let count = arr.reduce<Record<number, number>>((p, i) => {
//     return {
//       ...p,
//       [i]: 0,
//     };
//   }, {});

//   let n = 1_000_000; // 重复 100 万次

//   for (let i = 0; i < n; i++) {
//     let res = arrShuffle(arr);
//     res.forEach((v, k) => {
//       if (v === k) {
//         // 对随机选取的元素进行记录
//         count[k] = count[k] + 1;
//       }
//     });
//   }

//   console.log(count);
// }
