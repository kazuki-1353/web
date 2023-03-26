/*

let sortedArr = quickSort(ARR); // 升序排序, 无副作用
let sortedArr = quickSort(ARR, true); // 降序排序, 默认为升序
let sortedArr = quickSort(ARR, true, true); // 有副作用, 速度更快, 默认为无副作用

 */

/** 有副作用快速排序 */
const quickSortHasEff = (arr, isDesc, left = 0, right = arr.length - 1) => {
  if (left < right) {
    /** 基准点元素 */
    const pivotItem = arr[left];

    /** 待换位索引: 基准点的下一个索引 */
    let next = left + 1;

    for (let i = next; i <= right; i += 1) {
      /** 当前元素 */
      const sideItem = arr[i];

      /** 按指定排序方式判断是否需要换位 */
      const needSwap = isDesc
        ? sideItem > pivotItem // 降序, 判断当前元素是否大于基准点元素
        : sideItem < pivotItem; // 升序, 判断当前元素是否小于基准点元素

      if (needSwap) {
        [arr[i], arr[next]] = [arr[next], arr[i]]; // 将当前元素和待换位元素换位
        next += 1; // 待换位索引更新
      }
    }

    /** 最后一个已换位索引 */
    const pivotIndex = next - 1;
    [arr[left], arr[pivotIndex]] = [arr[pivotIndex], arr[left]]; // 将基准点元素和已换位元素换位, 使其分隔两个区间

    quickSortHasEff(arr, isDesc, left, pivotIndex - 1); // 递归比基准点小的数组
    quickSortHasEff(arr, isDesc, pivotIndex + 1, right); // 递归比基准点大的数组
  }

  return arr;
};

/** 无副作用快速排序 */
const quickSortNoEff = (arr, isDesc) => {
  const len = arr.length;
  if (len < 2) return arr;

  /** 中间基准点 */
  const pivotIndex = Math.floor(len / 2);

  /** 基准点元素 */
  const pivotItem = arr[pivotIndex];

  /** 比基准点小的数组 */
  const leftArr = [];

  /** 比基准点大的数组 */
  const rightArr = [];

  for (let i = 0; i < len; i += 1) {
    // 非中间基准点时
    if (i !== pivotIndex) {
      /** 当前元素 */
      const sideItem = arr[i];

      // 判断当前元素是否小于基准点元素
      if (sideItem < pivotItem) {
        leftArr.push(sideItem); // 插入到比基准点小的数组
      } else {
        rightArr.push(sideItem); // 插入到比基准点大的数组
      }
    }
  }

  /** 按指定排序方式递归基准点两边的数组 */
  const sideArr = (side) => {
    /** 要传入的数组 */
    let argArr;
    switch (side) {
      // 基准点左边
      case 'left':
        argArr = isDesc ? rightArr : leftArr;
        break;

      // 基准点右边
      case 'right':
        argArr = isDesc ? leftArr : rightArr;
        break;

      default:
        break;
    }

    // 递归数组
    return quickSortNoEff(argArr, isDesc);
  };

  return [...sideArr('left'), pivotItem, ...sideArr('right')];
};

/** 快速排序 */
const quickSort = (
  arr,
  /** 是否降序 */ isDesc = false,
  /** 有无副作用 */ hasEff = false,
) => {
  const len = arr.length;
  if (len < 2) return arr;

  // 判断是否有副作用
  return hasEff ? quickSortHasEff(arr, isDesc) : quickSortNoEff(arr, isDesc);
};

module.exports = quickSort;
