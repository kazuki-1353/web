/* 

<input type='file' onChange={onFileChange} />

*/

const FilePlus = class {
  file = null;

  constructor(file = null) {
    this.file = file;
  }

  /** 读取文件内容到ArrayBuffer */
  fileToArrayBuffer() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = reject;

      // 注册文件读取完成后的回调函数
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        resolve(arrayBuffer);
      };

      // 读取文件内容到ArrayBuffer
      reader.readAsArrayBuffer(this.file);
    });
  }

  /** 将ArrayBuffer转为十六进制字符串 */
  arrayBufferToHexString(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    const hexString = uint8Array
      .map((i) => {
        return i.toString(16).padStart(2, '0');
      })
      .join('');
    return Promise.resolve(hexString);
  }

  fileToString() {
    if (!this.file) return Promise.resolve('');

    return fileToArrayBuffer(this.file)
      .then(arrayBufferToHexString)
      .catch((error) => {
        console.error('文件读取失败:', error);
      });
  }
};

export const onFileChange = (e, cb) => {
  const file = e.target.files[0]; // 获取选中的文件
  const filePlus = new FilePlus(file);
  cb(filePlus);
};
