// import type { InitialState } from 'umi';
import type { getInitialState } from '@/app';

type InitialState = FunctionAwaited<typeof getInitialState>;

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: InitialState = {}) {
  const { currentUser } = initialState;
  const test = (reg: RegExp) => {
    if (currentUser) {
      return reg.test(currentUser.platform);
    } else {
      return false;
    }
  };

  return {
    ACCESS: test(/ACCESS/),
  };
}
