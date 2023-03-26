let isDev = true;
// isDev = false;
if (process.env.NODE_ENV === 'production') isDev = false;

export default {
  isDev,

  version: '1.0.0',
  name: '',

  domain: isDev ? '/api/local/' : '/api/',
};

export const rpx2px = (rpx: any, design = 750) => {
  const isNumber = Number(rpx);
  const width = document.body.scrollWidth;
  const pxRatio = width / design;
  const rem = isNumber ? pxRatio * +rpx : rpx;
  return rem ?? 0;
};
