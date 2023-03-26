type Value =
  | number
  | {
      value: number;
    };

/**最小堆类: 堆顶为最小值 */
class MinHeap {
  constructor(arr = []) {
    if (arr.length) {
      arr.forEach((i) => this.insert);
    }
  }

  heap: Value[] = [];

  /**插入节点 */
  insert(value: Value) {
    // 插入到堆的底部
    this.heap.push(value);

    // 然后上移： 将这个值和它的父节点进行交换，知道父节点小于等于这个插入的值
    this.up(this.heap.length - 1);
  }

  /**上移节点 */
  up(index: number) {
    if (index == 0) return;

    // 获取当前节点
    let current = this.heap[index];
    let currentValue = typeof current === 'number' ? current : current.value;

    // 获取父节点
    let parentIndex = this.getParentIndex(index);
    let parent = this.heap[parentIndex];
    let parentValue = typeof parent === 'number' ? parent : parent.value;

    // 如果父节点的值大于当前节点的值 就需要进行交换
    if (parentValue > currentValue) {
      this.swap(parentIndex, index);

      // 然后继续上移
      this.up(parentIndex);
    }
  }

  /**下移节点 */
  down(index: number) {
    // 获取当前节点
    let current = this.heap[index];
    let currentValue = typeof current === 'number' ? current : current.value;

    // 获取左右节点
    let [leftIndex, rightIndex] = this.getChildrenIndex(index);

    // 如果左子节点小于当前的值
    let left = this.heap[leftIndex];
    let leftValue = typeof left === 'number' ? left : left.value;
    if (leftValue < currentValue) {
      this.swap(leftIndex, index); //进行节点交换
      this.down(leftIndex); //继续进行下移
    }

    // 如果右侧节点小于当前的值
    let right = this.heap[rightIndex];
    let rightValue = typeof right === 'number' ? right : right.value;
    if (rightValue < currentValue) {
      this.swap(rightIndex, index); //进行节点交换
      this.down(rightIndex); //继续进行下移
    }
  }

  /**交换节点的值 */
  swap(i1: number, i2: number) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  /**删除堆项 */
  shift() {
    // 把数组最后一位 转移到数组头部
    this.heap[0] = this.heap.shift();

    // 进行下移操作
    this.down(0);
  }

  /**获取父节点索引 */
  getParentIndex(i: number) {
    return (i - 1) >> 1; //除以2, 取小整
  }

  /**获取子节点索引 */
  getChildrenIndex(i: number) {
    let b = i << 1; //乘以2
    return [
      b + 1, //获取左侧节点索引
      b + 2, //获取右侧节点索引
    ];
  }

  /**获取堆元素 */
  getItem(i = 0): Value {
    return this.heap[i];
  }

  /**获取堆大小 */
  getSize(): number {
    return this.heap.length;
  }
}

module.exports = MinHeap;
