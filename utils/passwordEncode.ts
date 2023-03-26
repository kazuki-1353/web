/*

加密
=
密码 > base64
^
时间戳(秒) > 倒序前补位((时间戳)=>间戳时间戳时间戳)

yarn add js-base64

import passwordEncode from '../../utils/passwordEncode';

let password=passwordEncode(VAL);
let password=passwordEncode({
  KEY1:VAL1,
  KEY2:VAL2,
});

password.time //加密时间戳
password.source //源密码
password.base64 //源密码的base64
password.code //加密后的密码

 */

import { Base64 } from 'js-base64';

type Result = ReturnType<typeof getCode>;
const getCode = (time: string, arg: string) => {
  const base64 = String(Base64.encode(arg));
  const arr: string[] = [];

  for (let l = base64.length, i = 1; l; i += 1) {
    l -= 1;
    const base64S = base64.charCodeAt(l);

    const timeI = time.length - i;
    const timeS = timeI < 0 ? time.charCodeAt(time.length + timeI) : time.charCodeAt(timeI);

    /* eslint no-bitwise: ["error", { "allow": ["^"] }] */
    const s = String.fromCharCode(base64S ^ timeS);
    arr.push(s);
  }

  return {
    source: arg,
    base64: base64.toString(),
    code: arr.reverse().join(''),
  };
};

const getCodes = (time: string, arg: string | Record<string, string>) => {
  switch (typeof arg) {
    case 'string': {
      const res = getCode(time, arg);
      return res;
    }

    case 'object': {
      const keys = Object.keys(arg);
      const obj = keys.reduce((p, k) => {
        const v = arg[k];
        const res = getCode(time, v);
        return {
          ...p,
          [k]: res,
        };
      }, {} as Record<string, Result>);

      return obj;
    }

    default:
      throw new Error('传入参数异常');
  }
};

export default function passwordEncode(arg: string): Result & {
  time: string;
};
export default function passwordEncode(arg: Record<string, string>): Record<string, Result> & {
  time: string;
};
export default function passwordEncode(arg: any) {
  const time = String(Math.round(Date.now() / 1000));
  const res = getCodes(time, arg);

  return {
    time,
    ...res,
  };
}
