let pxRatio: number;
let rpx2px = (rpx: any, design = 750) => {
  let number = Number(rpx);
  if (number) {
    if (!pxRatio) {
      let width = document.body.scrollWidth;
      pxRatio = width / design;
    }

    let rem = pxRatio * number;
    let isInteger = Number.isInteger(rem);
    if (isInteger) {
      return rem;
    } else {
      return +rem.toFixed(2);
    }
  } else {
    return rpx || 0;
  }
};

export default rpx2px;
