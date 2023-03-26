/* 组合二元数组为以元素索引为键的对象

import arrCompose from '../../utils/arrCompose';

// 二元数组
arrCompose<ITEM>(ARR)

// 对象数组
arrCompose<ITEM>(ARR, 'KEY')

 */

type Compose<T> = {
  index: Record<number, number>;
  item:
    | T[]
    | {
        parent: {
          [key: string]: any | T[];
        }[];
        child: T;
      }[];
};

type Result<T> = {
  [key: string]: Compose<T> & { id: string };
};

function fun<T>(source: T[][]): Result<T>;
function fun<T>(
  source: {
    [key: string]: any | T[];
  }[],
  key: string,
): Result<T>;

function fun<T>(source, key?) {
  let obj = {} as Result<T>;

  let compose = (sourceIndex = 0, arg = {} as Compose<T>) => {
    let { index, item } = arg;

    if (sourceIndex >= source.length) {
      let keys = Object.keys(index);
      let id: string = keys.reduce((pk, ck) => {
        let v = index[ck];
        return pk === '' ? v : pk + '-' + v;
      }, '');

      obj[id] = {
        id,
        ...arg,
      };
    } else {
      let sourceItem = source[sourceIndex];
      let isArray = sourceItem instanceof Array;

      let children = isArray ? sourceItem : sourceItem[key];
      children.forEach((child, childIndex) => {
        let _item = isArray
          ? child
          : {
              parent: sourceItem,
              child,
            };

        compose(sourceIndex + 1, {
          index: index
            ? {
                ...index,
                [sourceIndex]: childIndex,
              }
            : {
                [sourceIndex]: childIndex,
              },

          item: item ? [...item, _item] : [_item],
        });
      });
    }
  };

  compose();
  return obj;
}

export default fun;

/* 测试 */
// let arr = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];
// console.log(fun<number>(arr));

// let obj = [
//   {
//     id: 1,
//     arr: [1, 2, 3],
//   },
//   {
//     id: 2,
//     arr: [4, 5, 6],
//   },
//   {
//     id: 3,
//     arr: [7, 8, 9],
//   },
// ];
// console.log(fun<number>(obj, 'arr'));
/* 测试 */
