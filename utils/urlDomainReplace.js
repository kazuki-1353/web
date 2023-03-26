/*

import urlDomainReplace from '../utils/urlDomainReplace';

urlDomainReplace(来源地址, 目标地址)

// 限定为本地地址转换为远程地址
urlDomainReplace(本地地址, 远程地址, true)



import urlDomainReplace, { reg, regLocal } from '../utils/urlDomainReplace';

reg.exec(href);
regLocal.exec(href);

*/

export const reg = new RegExp(/^(?<protocol>\w+:\/\/)?([^/]+)/);
export const regLocal = new RegExp(
  /^(?<protocol>\w+:\/\/)?(localhost|(192\.168\.\d+\.\d+)):\d+/,
);

/**替换域名 */
export default function urlDomainReplace(source, target, isLocal) {
  if (!source) throw new Error('缺失来源地址');
  if (!target) throw new Error('缺失目标地址');

  let exec = reg.exec(target);
  let [, protocol, host] = exec;

  let href = source.replace(isLocal ? regLocal : reg, (match, g1) => {
    let str = `${protocol || g1 || ''}${host}`;
    return str;
  });

  return href;
}

// let href = urlDomainReplace(
//   // 'aa.com',
//   // 'http://aa.com',
//   'http://aa.com/a?id=a',
//   'bb.com',
//   // 'https://bb.com',
//   // 'https://bb.com/b?id=b',
// );
// console.log(href);

// let local2remote = urlDomainReplace(
//   '192.168.1.112:10086',
//   // 'http://192.168.1.112:10086/index?id=1',
//   // 'http://localhost:10086/index?id=1',
//   // 'edu.yocone.com',
//   'edu.yocone.com/index?id=2',
//   // 'https://edu.yocone.com/index?id=2',
//   true,
// );
// console.log(local2remote);
