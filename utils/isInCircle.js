/** 判断一个点是否在一个圆内部 */
let isInCircle = (x, y, circleX, circleY, circleR) => {
  // 计算点到圆心的距离的平方
  let distanceSquared = (x - circleX) ** 2 + (y - circleY) ** 2;

  // 计算半径的平方
  let radiusSquared = circleR ** 2;

  // 比较距离的平方和半径的平方, x^2 + y^2 \leq 1
  return distanceSquared <= radiusSquared;
};

export default isInCircle;
