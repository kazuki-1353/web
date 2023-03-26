/* 

// 移除指定元素
arrReplace(ARR,IND)
arrReplace(ARR,'STR')
arrReplace(ARR,(v,k)=>BOO)

// 替换指定元素
arrReplace(ARR,IND,newITEM)
arrReplace(ARR,'STR',newITEM)
arrReplace(ARR,(v,k)=>BOO,newITEM)

*/

let isMatch = (condition, v, k) => {
  switch (typeof condition) {
    /* 条件函数 */
    case 'function':
      return condition(v, k);

    /* 数组索引 */
    case 'number':
      return condition === k;

    default:
      return condition === v;
  }
};

module.exports = function replace(arr, condition, item) {
  if (item === undefined) {
    /* 移除元素 */
    return arr.filter((v, k) => {
      let _isMatch = isMatch(condition, v, k);
      return !_isMatch;
    });
  } else {
    /* 替换元素 */
    return arr.reduce((p, v, k) => {
      let _isMatch = isMatch(condition, v, k);
      if (_isMatch) {
        return [...p, item];
      } else {
        return [...p, v];
      }
    }, []);
  }
};
