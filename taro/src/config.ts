let isDev = true;
// isDev = false;
if (process.env.NODE_ENV === 'production') isDev = false;

export default {
  isDev,

  /**是否开启redux-logger */
  reduxLogger: false,

  version: '1.0.0',
  name: '',

  /**请求域名 */
  domain: isDev ? '/api/local/' : '/api/',
};
