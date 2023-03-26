declare module '*.css';
declare module '*.scss';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
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

type FunctionAwaited<T extends Function> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : any;
