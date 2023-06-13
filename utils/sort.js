/** 置换函数 */
function swap(arr, index1, index2) {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

/** 查找函数, 二分法 */
function searchBinary(arr, end, value) {
  let min = 0;
  let max = end;

  while (min <= max) {
    let mid = Math.floor((min + max) / 2);

    if (arr[mid] <= value) {
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }

  return min;
}

/** 冒泡排序 */
function bubble(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }

  return arr;
}

/** 冒泡排序, 利用索引优化 */
function bubbleWI(arr) {
  let i = arr.length - 1;

  while (i > 0) {
    /* 最后一次换位的索引 */
    let pos = 0;

    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        pos = j;
        swap(arr, j, j + 1);
      }
    }

    i = pos;
  }

  return arr;
}

/** 冒泡排序, 每趟排序中进行正向和反向两遍冒泡 */
function bubbleFAR(arr) {
  let start = 0;
  let end = arr.length - 1;

  while (start < end) {
    /* 最后一个未确定的索引 */
    let endPos = 0;
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        endPos = i;
        swap(arr, i, i + 1);
      }
    }
    end = endPos;

    /* 最前一个未确定的索引 */
    let startPos = 0;
    for (let i = end; i > start; i--) {
      if (arr[i - 1] > arr[i]) {
        startPos = i;
        swap(arr, i - 1, i);
      }
    }
    start = startPos;
  }

  return arr;
}

/** 插入排序 */
function insertion(arr) {
  for (let i = 1, len = arr.length; i < len; i++) {
    let temp = arr[i];
    let preIndex = i - 1;

    while (arr[preIndex] > temp) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex -= 1;
    }
    arr[preIndex + 1] = temp;
  }

  return arr;
}

/** 插入排序, 利用二分法 */
function insertionWB(arr) {
  for (let i = 1, len = arr.length; i < len; i++) {
    let temp = arr[i];
    let insertIndex = searchBinary(arr, i - 1, arr[i]);

    for (let preIndex = i - 1; preIndex >= insertIndex; preIndex--) {
      arr[preIndex + 1] = arr[preIndex];
    }

    arr[insertIndex] = temp;
  }

  return arr;
}

/** 希尔排序 */
function shell(arr) {
  let len = arr.length;
  let gap = Math.floor(len / 2);

  while (gap > 0) {
    for (let i = gap; i < len; i++) {
      let temp = arr[i];
      let preIndex = i - gap;

      while (arr[preIndex] > temp) {
        arr[preIndex + gap] = arr[preIndex];
        preIndex -= gap;
      }
      arr[preIndex + gap] = temp;
    }

    gap = Math.floor(gap / 2);
  }

  return arr;
}

/** 归并排序 */
function concat(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let mid = Math.floor(len / 2);

  let left = arr.slice(0, mid);
  let right = arr.slice(mid);

  let leftConcat = concat(left);
  let rightConcat = concat(right);

  let result = [];
  while (leftConcat.length > 0 && rightConcat.length > 0) {
    /* 获取两边里小的那个元素 */
    let min =
      leftConcat[0] <= rightConcat[0]
        ? leftConcat.shift()
        : rightConcat.shift();

    result.push(min);
  }

  /* 合并剩余元素 */
  return result.concat(leftConcat, rightConcat);
}

/** 快速排序 */
function quick(arr, isDesc, left = 0, right = arr.length - 1) {
  if (left < right) {
    /** 基准点元素 */
    let pivotItem = arr[left];

    /** 待换位索引: 基准点的下一个索引 */
    let next = left + 1;

    for (let i = next; i <= right; i += 1) {
      /** 当前元素 */
      let sideItem = arr[i];

      /** 按指定排序方式判断是否需要换位 */
      let needSwap = isDesc
        ? sideItem > pivotItem // 降序, 判断当前元素是否大于基准点元素
        : sideItem < pivotItem; // 升序, 判断当前元素是否小于基准点元素

      if (needSwap) {
        [arr[i], arr[next]] = [arr[next], arr[i]]; // 将当前元素和待换位元素换位
        next += 1; // 待换位索引更新
      }
    }

    /** 最后一个已换位索引 */
    let pivotIndex = next - 1;
    [arr[left], arr[pivotIndex]] = [arr[pivotIndex], arr[left]]; // 将基准点元素和已换位元素换位, 使其分隔两个区间

    quick(arr, isDesc, left, pivotIndex - 1); // 递归比基准点小的数组
    quick(arr, isDesc, pivotIndex + 1, right); // 递归比基准点大的数组
  }

  return arr;
}

/** 快速排序, 无副作用 */
function quickNE(arr, isDesc) {
  let len = arr.length;
  if (len < 2) return arr;

  /** 中间基准点 */
  let pivotIndex = Math.floor(len / 2);

  /** 基准点元素 */
  let pivotItem = arr[pivotIndex];

  /** 比基准点小的数组 */
  let leftArr = [];

  /** 比基准点大的数组 */
  let rightArr = [];

  for (let i = 0; i < len; i += 1) {
    // 非中间基准点时
    if (i !== pivotIndex) {
      /** 当前元素 */
      let sideItem = arr[i];

      // 判断当前元素是否小于基准点元素
      if (sideItem < pivotItem) {
        leftArr.push(sideItem); // 插入到比基准点小的数组
      } else {
        rightArr.push(sideItem); // 插入到比基准点大的数组
      }
    }
  }

  /** 按指定排序方式递归基准点两边的数组 */
  let sideArr = (side) => {
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
    return quickNoEff(argArr, isDesc);
  };

  return [...sideArr('left'), pivotItem, ...sideArr('right')];
}

// export default {
//   bubble,
//   bubbleWI,
//   bubbleFAR,

//   insertion,

//   quick,
//   quickNE,
// };

/* test-s */

// let arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));

// console.log(bubbleWI(arr));
// console.log(bubbleFAR(arr));
// console.log(concat(arr));

/* test-e */
