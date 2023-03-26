import config from '@/config';
import request from '@/services/request';
import type { Option } from '@/services/request';

const api = request({
  domain: config.domain,
  header: {
  // header: {
  //   token() {},
  // },
  },
  async retry() {
  },
});

/*  */
/*  */
/*  */
/**  */
export function TEMP(
  data: {},
  option?: Option,
): Promise<{
  data: {};
}>;
export function TEMP(data: Record<string, any>, option = {}) {
  return api(
    {
      url: '/',
      method: 'POST',
      data,
    },
    option,
  );
}

export default {
};
