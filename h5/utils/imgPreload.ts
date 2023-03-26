export default (
  resources: string[],
  options?: {
    /**超时 */ timeout: number;
  },
  cb?: (res: { done: boolean; value: number }) => void,
) => {
  let count = 0;

  /**超时 */
  let timeout = new Promise((resolve) => {
    setTimeout(() => {
      let percent = (count / resources.length) * 100;

      resolve({
        done: true,
        value: Math.ceil(percent),
      });
    }, options?.timeout || 5000);
  });

  let imgs = resources.map((i) => {
    return new Promise<string>((resolve, reject) => {
      let img = new Image();
      img.src = i;
      img.onload = () => {
        count += 1;
        let percent = (count / resources.length) * 100;

        cb?.({
          done: false,
          value: Math.ceil(percent),
        });

        resolve(i);
      };
      img.onerror = () => {
        reject(i);
      };
    });
  });

  /**所有图片获取成功 */
  let success = Promise.all(imgs).then(() => {
    let res = {
      done: true,
      value: 100,
    };

    cb?.(res);
    return res;
  });

  return Promise.race([timeout, success]);
};
