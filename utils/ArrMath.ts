/*

import ArrMath from '@/utils/ArrMath';

let arrMath = new ArrMath(ARR);

arrMath.total
arrMath.min
arrMath.max

arrMath.getAverage()
arrMath.getCount(N)

// 中间值
let median = arrMath.getMedian();
if (Array.isArray(median)) {
} else {
}

*/

class ArrMath {
  constructor(arr: (string | number)[]) {
    this.arr = arr;
    this.collection = arr.reduce((p, i) => {
      this.total += +i;
      this.setMinMax(+i);

      const v = p.get(i);
      if (typeof v === 'number') {
        p.set(i, v + 1);
        return p;
      } else {
        p.set(i, 1);
        return p;
      }
    }, new Map<string | number, number>());
  }

  arr: (string | number)[];
  collection: Map<string | number, number>;
  /**合计值 */ total: number = 0;

  sort(fun?: Parameters<typeof Array.prototype.sort>[0]) {
    const list = [...this.collection.keys()];
    return list.sort(fun || ((a, b) => +a - +b));
  }

  /**最小值 */ min?: number;
  /**最大值 */ max?: number;
  private setMinMax(num: number) {
    if (this.min === undefined) this.min = num;
    if (this.max === undefined) this.max = num;

    if (this.min > num) this.min = num;
    if (this.max < num) this.max = num;
  }

  /**中间值 */
  getMedian() {
    const list = this.sort();
    const center = list.length / 2;
    const index = Math.floor(center);

    if (list.length % 2) {
      /* 奇数数组 */
      return +list[index];
    } else {
      /* 偶数数组 */
      return [+list[index - 1], +list[index]];
    }
  }

  /**平均值 */
  getAverage() {
    const average = this.total / this.arr.length;
    return Math.round(average);
  }

  /**获取元素重复次数 */
  getCount(item: string | number) {
    return this.collection.get(item) as number;
  }
}

export default ArrMath;

/* 测试 */
// const arr = ['20.00', '100.00', '22.19'];
// const arrMath = new ArrMath(arr);
// console.log(arrMath.sort());
// console.log('min', arrMath.min);
// console.log('max', arrMath.max);
// console.log('median', arrMath.getMedian());
// console.log('average', arrMath.getAverage());
/* 测试 */
