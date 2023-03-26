import type { RequestConfig } from 'umi';

import config from '@/config';
export const request: RequestConfig = {
  errorConfig: {
    adaptor(res) {
      return {
        ...res,
        success: res.success || res.code === 0 || res.code === 200,
        errorCode: res.errorCode || res.errCode || res.code,
        errorMessage: res.errorMessage || res.errMsg || res.msg || res,
      };
    },
  },

  requestInterceptors: [
    (url, options) => {
      return {
        url: config.domain + url,
        options,
      };
    },
  ],
};
