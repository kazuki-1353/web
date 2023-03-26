import config from '../config';
import request, { Option } from './request';
import system from '../utils/system';

let retry = async () => {
  // system.delToken();
  // return true;
};

let api = request({
  domain: config.domain,
  header: {
    token() {
      // return system.getToken().catch((err) => {
      //   retry();
      //   throw err;
      // });
    },
  },
  retry,
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

export default {};
