/** 分批处理函数 */
const funBatch = async <T, R>(
  list: T[],
  task: (item: T, index: number, batch: T[], batchIndex: number) => Promise<R>,
  options?: {
    size?: number;
    then?: (res: {
      processed: number;
      result: PromiseSettledResult<R>[];
    }) => void;
  },
): Promise<void> => {
  const { length } = list;
  const { size = 2, then } = options || {};

  for (let index = 0; index < length; index += size) {
    const endIndex = index + size;
    const batch = list.slice(index, endIndex); // 按批次分割
    const result = await Promise.allSettled(
      batch.map(async (data, batchIndex) => {
        return await task(data, index + batchIndex, batch, batchIndex); // 执行批次内的任务
      }),
    );

    const processed =
      endIndex < length ? Math.round((endIndex / length) * 10000) / 100 : 100;

    then?.({
      processed,
      result,
    });
  }
};

module.exports = funBatch;

/* TEST */
// const proms = Array(9).fill(null);
// const fun = (data: number) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(data);
//       console.log(data);
//     }, 1000);
//   });
// };
// funBatch(
//   proms,
//   async (_, k) => {
//     return fun(k);
//   },
//   {
//     then(res) {
//       console.log(res);
//     },
//   },
// );
// funBatch(
//   proms,
//   async (_, k, b, bi) => {
//     if (bi === 0) {
//       return await fun(k);
//     }
//   },
//   {
//     then(res) {
//       console.log(res);
//     },
//   },
// );
/* TEST */
