/* 

字串补位

import strPad from '../../utils/strPad';
strPad('','')
strPad('','',{
  mode:'end',
  padString:' ',
})

 */

module.exports = (
  source: string,
  target: string,
  opt: {
    mode: 'start' | 'end';
    padString: string;
  },
) => {
  let sourceL = source.length;
  let targetL = target.length;
  let diff = sourceL - targetL;

  let { mode = 'start', padString = '0' } = opt || {};
  switch (mode) {
    case 'start': {
      switch (true) {
        case diff > 0:
          return target.padStart(sourceL, padString);

        case diff < 0:
          return target.slice(-diff, targetL);
      }
    }

    case 'end': {
      switch (true) {
        case diff > 0:
          return target.padEnd(sourceL, padString);

        case diff < 0:
          return target.slice(0, sourceL);
      }
    }

    default: {
      return target;
    }
  }
};

/* 测试 */
// let time = new String((Date.now() / 1000).toFixed(0));
// console.log(time);

// console.log(module.exports('123456', time));
// console.log(
//   module.exports(time, '123456', {
//     padString: 'abc',
//   }) === 'abca123456',
// );

// console.log(
//   module.exports('123456', time, {
//     mode: 'end',
//   }),
// );
// console.log(
//   module.exports(time, '123456', {
//     mode: 'end',
//   }) === '1234560000',
// );
