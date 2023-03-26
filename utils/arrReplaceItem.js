/* 

//替换相同的元素
arrReplaceItem(数组,旧元素,新元素)
arrReplaceItem(数组,[旧元素],[新元素])

//替换不相同的元素
arrReplaceItem(数组,[旧元素],[新元素],true)

 */

/**替换数组内的元素 */
module.exports = (arr, source, target, isDiff = false) => {
  let isArray = Array.isArray(source);
  if (isArray) {
    if (!source.length) return arr;
    if (!target.length) return arr;

    let indexs = arr.reduce((p, v, k) => {
      let index = source.findIndex((item) => v === item);
      if (~index) {
        return isDiff ? p : [...p, k];
      } else {
        return isDiff ? [...p, k] : p;
      }
    }, []);

    let newArr = [...arr];

    target.forEach((v, k) => {
      let index = indexs[k];
      newArr[index] = v;
    });

    return newArr;
  } else {
    let newArr = arr.map((i) => {
      if (i === source) {
        return i;
      } else {
        return target;
      }
    });
    return newArr;
  }
};
