/*

import uploadFile from './services/uploadFile';

uploadFile<{
  data: {
    image: string;
  };
}>({
  url: '',
  data: {
    image,
  },
  dataKey: 'image',
}).then((res) => {
  let { image } = res.data;
};

*/

import Taro from '@tarojs/taro';

/**已上传文件 */
let cache = {};

function uploadFile<T>(arg: {
  /**接口路径 */ url: string;
  /**接口参数 */ data: Record<string, any>;
  /**参数中的文件键名 */ dataKey?: string;

  header?: Record<string, string> | (() => Promise<Record<string, string>>);
}): Promise<T>;
function uploadFile(arg) {
  let { url, data, dataKey = 'path', header = {} } = arg;
  let filePath = data[dataKey];

  let uploaded = cache[filePath];
  if (uploaded) {
    console.log('曾经上传', uploaded);
    return Promise.resolve(uploaded);
  }

  let headerProm =
    typeof header === 'function' ? header() : Promise.resolve(header);

  return (
    headerProm
      .then((_header: Record<string, string>) => {
        return new Promise((resolve, reject) => {
          Taro.uploadFile({
            url,
            formData: {
              ...data,
              [dataKey]: undefined,
            },
            name: dataKey,
            filePath,

            header: {
              'content-type': 'multipart/form-data',
              ..._header,
            },

            success: resolve,
            fail: reject,
          });
        });
      })

      // 微信回调
      .then((res: any) => {
        switch (res.statusCode) {
          case 200:
            return JSON.parse(res.data);

          default:
            throw res;
        }
      })

      // 后台回调
      .then((res) => {
        switch (res.code ?? res.errcode) {
          case 0: {
            console.log('上传成功', res.data);
            cache[filePath] = res;
            return res;
          }

          default:
            throw res;
        }
      })

      // 请求失败
      .catch((err) => {
        Taro.hideLoading();

        let { code, errcode, msg } = err;
        let title = msg ? `${code ?? errcode} - ${msg}` : '后台发生错误';
        Taro.showToast({
          title,
          icon: 'none',
        });

        throw err;
      })
  );
}

export default uploadFile;
