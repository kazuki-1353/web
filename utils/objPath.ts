/* 

// 在对象中寻找指定值的路径
findPath(data, value)
findPath(data, value, {
  valueKey: 'id',
  childrenKey: 'fields',
}),

// 在对象中寻找指定路径的值
findValue(data, paths)

*/

let findPath = (
  data: Record<string, any>,
  /**目标值 */ value: string | number,

  opt?: {
    /**值的键名 */ valueKey?: string;
    /**子代的键名 */ childrenKey?: string;
  },
): null | Array<string | number> => {
  let { valueKey = 'value', childrenKey = 'children' } = opt || {};

  if (data[valueKey] === value) {
    return [];
  } else {
    let children = data?.[childrenKey];
    if (!children?.length) return [];

    let paths: Array<string | number> = [childrenKey];

    for (let index = 0; index < children.length; index++) {
      let item = children[index];

      /* 已找到 */
      if (item[valueKey] === value) {
        return [...paths, index];
      }

      /* 在子代中寻找 */
      if (childrenKey in item) {
        /* 递归函数 */
        let childrenPaths = findPath(item, value, {
          valueKey,
          childrenKey,
        });

        /* 已找到 */
        if (childrenPaths?.length) {
          return [...paths, index, ...childrenPaths];
        }
      }
    }
  }

  return null;
};

let findValue = (
  source: Record<string, any>,
  paths: string | Array<string | number>,
) => {
  let _paths: Array<string | number>;

  if (Array.isArray(paths)) {
    if (!paths.length) return undefined;
    _paths = paths;
  } else {
    _paths = path.split('.');
  }

  let value = _paths.reduce((target, path) => {
    if (path in target) {
      return target[path];
    } else {
      return undefined;
    }
  }, source);
  return value;
};

export default { findPath, findValue };

/* 测试 */
// let data1 = {
//   id: 'id0',
//   name: 'root',
//   fields: [
//     {
//       id: 'id1',
//       name: 'name 1-1',
//       fields: [
//         {
//           id: 'id1-1',
//           name: 'name 1-1',
//         },
//         {
//           id: 'id1-2',
//           name: 'name 1-2',
//           fields: [
//             {
//               id: 'id1-2-1',
//               name: '目标对象',
//             },
//             {
//               id: 'id1-2-2',
//               name: '目标对象',
//             },
//             {
//               id: 'id1-2-3',
//               name: '目标对象',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'id2',
//       name: 'name 2-1',
//       fields: [
//         {
//           id: 'id2-1',
//           name: 'name 2-1',
//         },
//       ],
//     },
//   ],
// };

// console.log(
//   findPath(data1, 'id1-2-1', {
//     valueKey: 'id',
//     childrenKey: 'fields',
//   }),
// );
// console.log(
//   findPath(data1, 'id1-2-2', {
//     valueKey: 'id',
//     childrenKey: 'fields',
//   }),
// );
// console.log(
//   findPath(data1, 'id1-2-3', {
//     valueKey: 'id',
//     childrenKey: 'fields',
//   }),
// );
// console.log(
//   findPath(data1, 'id1-2-9', {
//     valueKey: 'id',
//     childrenKey: 'fields',
//   }),
// );
/* 测试 */
