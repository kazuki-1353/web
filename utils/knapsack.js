/* 背包算法: 获取购物车里价值最贴近指定金额的所有商品

knapsack(money, [])

*/


/** 把金额切割成10份 */
let slice = (money) => {
  let arr = [];
  let num = Math.floor(money / 10);

  for (let i = num; i < money; i += num) {
    arr.push(i);
  }

  arr.push(money);

  return arr;
};

/** 生成背包二维数组 */
let knapsackDB = (_slice, goods) => {
  /** 初始化背包 */
  let DB = Array.from({ length: goods.length + 1 }, () =>
    Array(_slice.length).fill(0),
  );

  for (let i = 1; i < DB.length; i++) {
    let current = goods[i - 1];

    _slice.forEach((sv, sk) => {
      /** 剩余金额 */
      let remaining = sv - current;
      if (remaining >= 0) {
        let index = _slice.findIndex((i) => i >= remaining); // 寻找剩余金额的相关索引
        if (sv < DB[i - 1][index] + current) index -= 1; // 如果相加后超出当前分块则减一

        if (index >= 0) {
          /* if 上次金额 < 剩余金额加当前金额 */
          if (DB[i - 1][sk] < DB[i - 1][index] + current) {
            DB[i][sk] = DB[i - 1][index] + current; // 更新为剩余金额加当前金额
            return;
          }
        } else {
          /* if 上次金额 < 当前金额 */
          if (DB[i - 1][sk] < current) {
            DB[i][sk] = current;
            return;
          }
        }
      }

      DB[i][sk] = DB[i - 1][sk]; // 继承上次金额
    });
  }

  console.table(DB);
  return DB;
};

let knapsack = (money, goods) => {
  /** 分割背包空间 */
  let _slice = slice(money);

  let DB = knapsackDB(_slice, goods);
  let arr = [];

  /** 剩余金额 */
  let remaining = money;

  /** 最后的分块索引 */
  let index = _slice.length - 1;

  for (let i = DB.length - 1; i > 0; i--) {
    /* if 当前金额 > 上面金额 */
    if (DB[i][index] > DB[i - 1][index]) {
      /* if 当前金额 <= 剩余金额  */
      if (DB[i][index] <= remaining) {
        let current = goods[i - 1];
        remaining -= current;
        arr.push(current); // 保存当前商品

        index = _slice.findIndex((i) => i >= remaining); // 寻找剩余金额的相关索引
      }
    }
  }

  return arr;
};

module.exports = knapsack;

/* 测试 开始 */
// {
//   // console.log('slice(100) =', slice(100)); // [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

//   // let randomARR = [
//   //   22, 26, 19, 2, 11, 41, 3, 26, 25, 7, 32, 1, 23, 19, 48, 69, 31, 11, 17, 75,
//   //   10, 46, 16, 47, 35, 45, 52, 20, 19, 9, 56, 6, 40, 14, 36, 8, 56, 24, 62, 6,
//   //   31, 23, 58, 4, 36, 64, 56, 46, 12, 3,
//   // ];
//   // console.log(randomARR.sort(() => Math.random() - 0.5));

//   let randomARR = Array.from({ length: 50 }, () =>
//     Math.floor(1 + Math.random() * 75),
//   );

//   let arr = knapsack(100, randomARR);
//   console.log(
//     arr.reduce((p, i) => p + i, 0),
//     arr,
//   );

//   console.table(randomARR);
//   console.log(randomARR.sort((a, b) => b - a));
// }
/* 测试 结束 */
