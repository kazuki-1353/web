/*

arrRandom(ARR, NUM)
arrRandom(ARR, NUM, STA)
arrRandom(ARR, NUM, STA, END)

*/

/** 随机获取数组中的元素
 * @param arr 数组
 * @param num 获取数量
 * @param start 开始索引
 * @param end 结束索引
 * @returns 随机数组
 */
let arrRandom = <T = any>(
  arr: any[],
  num: number,
  start = 0,
  end = arr.length - 1,
): T[] => {
  let res: T[] = [];

  // 前 num 个元素先默认选上
  for (let i = 0; i < num; i++) {
    res[i] = arr[i + start];
  }

  // 循环遍历数组区间
  for (let i = num; i <= end - start; i++) {
    // 生成一个 [0, i] 之间的整数
    let random = Math.floor(Math.random() * (i + 1));

    // random 小于 num 的概率就是 num/i
    if (random < num) {
      res[random] = arr[start + i];
    }
  }

  return res;
};

export default arrRandom;

/* 测试 */
// {
//   let num = 5;
//   let start = 0;
//   let end = 99;

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
//     let res = arrRandom(arr, num, start, end);
//     res.forEach((v) => {
//       // 对随机选取的元素进行记录
//       count[v] = count[v] + 1;
//     });
//   }

//   console.log(count);
// }
