import config from './config';

const { domain } = config;
export default (api, data) => {
  console.log('请求', api, data);

  let prom;

  switch (api) {
    /**
     * 模板
     * @param {}
     * @returns {}
     */
    case '': {
      prom = Fun.request(`${domain}/${api}`, data);
      break;
    }

    default: {
      throw new Error('无此api');
    }
  }

  return prom;
};
