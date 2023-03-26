/* 

// 查找最大值
arrFindItem(ARR,{
  prop:'id',
  mode:'max',
})

// 查找最小值
arrFindItem(ARR,{
  prop:'id',
  mode:'min',
})

// 查找最大值
arrFindItem(ARR,{
  comparator: (accumulator, current) => accumulator.index > current.index,
})

// 查找最小值
arrFindItem(ARR,{
  comparator: (accumulator, current) => accumulator.index < current.index,
})

// 查找多个元素
arrFindItem(ARR,{
  comparator: (accumulator, current) => accumulator.index < current.index,
  count: 10,
})

 */

/**查找数组内指定的元素 */
module.exports = (
  arr: any[],
  opt: {
    prop?: string;
    mode?: 'max' | 'min';
    comparator?: (accumulator, current) => boolean;
    count?: number;
  },
) => {
  let { prop, mode, comparator, count = 1 } = opt;

  /**检查顺序是否正确 */
  let checkOrder = (accumulator, current) => {
    if (prop) {
      switch (mode) {
        case 'max':
          return accumulator[prop] > current[prop];

        case 'min':
          return accumulator[prop] < current[prop];

        default:
          throw new Error('模式错误');
      }
    } else {
      return comparator?.(accumulator, current);
    }
  };

  // 是否查找单个元素
  if (count === 1) {
    let list = arr.reduce((accumulator, current) => {
      let isOrder = checkOrder(accumulator, current);
      return isOrder ? accumulator : current;
    });

    return list;
  } else if (count < 10 || count < arr.length / 10) {
    let list = arr.reduce((p, accumulator) => {
      /**初始化结果数组 */
      if (p.length < count) {
        if (p.length) {
          /**是否比结果数组的元素更大或更小 */
          let shouldUpdate = checkOrder(accumulator, p[p.length - 1]);
          if (!shouldUpdate) return p;
        } else {
          /**第一个循环 */
          p.push(accumulator);
        }
      }

      /**需要插入的位置 */
      let index = p.findIndex((current) => {
        let isOrder = checkOrder(accumulator, current);
        return isOrder;
      });

      if (~index) {
        /**插入元素 */
        p.splice(index, 0, accumulator);
        p.length = count;
      }

      return p;
    }, []);

    return list;
  } else {
    // 先按模式进行排序
    let list = [...arr];
    list.sort((a, b) => {
      let isOrder = checkOrder(a, b);
      return isOrder ? -1 : 1;
    });

    list.splice(count);
    return list;
  }
};
