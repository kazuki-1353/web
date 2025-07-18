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

  /** 转换为String */
  fileToString() {
    if (!this.file) return Promise.resolve('');

    return fileToArrayBuffer(this.file)
      .then(arrayBufferToHexString)
      .catch((error) => {
        console.error('文件读取失败:', error);
      });
  }

  /** 转换为FormData */
  fileToFormData(chunkSize = 1024 * 1024) {
    const { size } = this.file;

    // 计算切片数量和每个切片的大小
    const totalChunks = Math.ceil(size / chunkSize);

    // 创建FormData对象，并添加文件信息
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('totalChunks', totalChunks);

    // 循环上传切片
    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      const start = chunkNumber * chunkSize;
      const end = Math.min(start + chunkSize, size);
      const chunk = selectedFile.slice(start, end);
      formData.append(`chunk-${chunkNumber}`, chunk, selectedFile.name);
    }

    return formData;
  }
};

export const onFileChange = (e, cb) => {
  const file = e.target.files[0]; // 获取选中的文件
  const filePlus = new FilePlus(file);
  cb(filePlus);
};
