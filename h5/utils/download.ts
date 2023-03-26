/* 下载文件

download('', 'image')
download('', 'image', 'img.png')

*/

let beforeDownload = (
  file: File | string,
  type: string,
  name?: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof file === 'string') {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', file);
      xhr.send();

      /* 设置文件名 */
      let downloadName: string;
      if (name) {
        downloadName = name;
      } else {
        let match = file.match(/.+\/((.+)\.(\w+))/);
        downloadName = match?.[1] || `${Date.now()}`;
      }

      xhr.onload = () => {
        let blob = new Blob([xhr.response], { type });
        download(blob, downloadName);
        resolve();
      };
    } else {
      let blob = new Blob([file], { type });
      let downloadName = name || `${Date.now()}`;
      download(blob, downloadName);
      resolve();
    }
  });
};

let download = (blob: Blob, name: string): void => {
  let a = document.createElement('a');
  let objURL = URL.createObjectURL(blob);

  a.href = objURL;
  a.download = name;
  a.click();

  URL.revokeObjectURL(objURL);
};

export default beforeDownload;
