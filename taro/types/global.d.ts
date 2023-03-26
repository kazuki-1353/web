/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
      | 'jd';
  }
}

/** 对象交集 */
type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>;

/** 对象差集 */
type Subtraction<T, U> = Omit<T, Extract<keyof T, keyof U>> &
  Omit<U, Extract<keyof T, keyof U>>;

/** 对象二选一 */
type EitherOr<L, R> =
| (L & { [P in Exclude<keyof R, keyof L>]?: never })
| (R & { [P in Exclude<keyof L, keyof R>]?: never });

/** 数组元素类型 */
type ItemType<T extends Array<any>> = T extends Array<infer U> ? U : any;

/** Promise 函数回调类型 */
type FunctionAwaited<T extends Function> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : any;
