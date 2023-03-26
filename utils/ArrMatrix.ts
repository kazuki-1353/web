/*

let arrMatrix = new ArrMatrix(10, 10);
arrMatrix.encode(x, y, z)
arrMatrix.decode(index)

*/

/** 矩阵转换
 * @param w 矩阵宽度
 * @param h 矩阵高度
 * @param d 矩阵深度
 */
let ArrMatrix = class {
  constructor(public w: number, public h: number, public d: number = 1) {}

  // 将三维数组中的坐标 (x, y, z) 转化为一维数组中的索引
  encode(x: number, y: number, z: number = 0): number {
    let index = x * this.h + y;

    if (z) {
      let area = this.w * this.h;
      index += z * area;
    }

    return index;
  }

  // 将一维数组中的索引转化为三维数组中的坐标 (x, y, z)
  decode(index: number): number[] {
    if (this.d > 1) {
      let area = this.w * this.h;
      let z = Math.floor(index / area);
      let _index = index % area;

      let x = Math.floor(_index / this.h);
      let y = _index % this.h;

      return [x, y, z];
    } else {
      let x = Math.floor(index / this.h);
      let y = index % this.h;
      return [x, y];
    }
  }
};

/* 测试 */
// {
//   let arrMatrix = new ArrMatrix(10, 10);
//   console.log(arrMatrix.encode(2, 2));
//   console.log(arrMatrix.decode(22));

//   let arrMatrix3 = new ArrMatrix(10, 10, 3);
//   console.log(arrMatrix3.encode(2, 2, 2));
//   console.log(arrMatrix3.decode(222));
// }
