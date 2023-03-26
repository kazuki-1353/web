/*

同一个接口短时间内多次调用时, 只调用一次接口, 等待回调后再执行函数

import funAwait from '../utils/funAwait';

funAwait
  .await('ID', () => {})
  .then(res=>{})

 */

let FunAwait = class {
  caches: Record<
    string,
    null | {
      id: string;
      list: {
        resolve: Function;
        reject: Function;
      }[];
    }
  > = {};

  await<T>(id: string, fun: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      let { caches } = this;
      let cache = caches[id];
      if (cache) {
        cache.list.push({ resolve, reject });
      } else {
        caches[id] = {
          id,
          list: [{ resolve, reject }],
        };

        this.run<T>(id, fun);
      }
    });
  }

  run<T>(id: string, fun: () => Promise<T>) {
    let { caches } = this;
    let cache = caches[id];

    fun()
      .then((res) => {
        if (!cache) return;

        let [...list] = cache.list;
        this.clear(id);

        list.forEach((i) => {
          i.resolve(res);
        });
      })
      .catch((err) => {
        if (!cache) return;

        let [...list] = cache.list;
        this.clear(id);

        list.forEach((i) => {
          i.reject(err);
        });
      });
  }

  clear(id: string) {
    let { caches } = this;

    if (id) {
      caches[id] = null;
    } else {
      caches = {};
    }
  }
};

let funAwait = new FunAwait();
export default funAwait;

// let test = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(Date.now());
//     }, 1000);
//   });
// };
// setTimeout(() => {
//   funAwait.await('id', test).then((res: any) => console.log(11, res));
// });
// setTimeout(() => {
//   funAwait.await('id', test).then((res: any) => console.log(22, res));
// });
// setTimeout(() => {
//   funAwait.await('id', test).then((res: any) => console.log(33, res));
// }, 1500);
// setTimeout(() => {
//   funAwait.await('id', test).then((res: any) => console.log(44, res));
// }, 2000);
// setTimeout(() => {
//   funAwait.await('id', test).then((res: any) => console.log(55, res));
// }, 2500);
