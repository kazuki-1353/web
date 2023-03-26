export const useCanvas = (url: string, width?: number, height?: number) => {
  return new Promise<string>((resolve, reject) => {
    let img = new Image();
    img.src = url;

    img.onerror = reject;
    img.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = width || img.width;
      canvas.height = height || img.height;

      let ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      let dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
  });
};

export const useAJAX = (url: string) => {
  return new Promise<Blob>((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';

    xhr.onerror = reject;
    xhr.onload = function() {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(this);
      }
    };

    xhr.send();
  }).then((blob) => {
    return new Promise<string>((resolve, reject) => {
      let oFileReader = new FileReader();

      oFileReader.onerror = reject;
      oFileReader.onloadend = function() {
        let base64 = this.result;
        if (typeof base64 === 'string') {
          resolve(base64);
        } else {
          reject(this);
        }
      };

      oFileReader.readAsDataURL(blob);
    });
  });
};

export const useFetch = (url: string) => {
  return fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.blob();
      } else {
        throw res;
      }
    })
    .then((blob) => {
      let src = window.URL.createObjectURL(blob);
      return src;
    });
};

export default useFetch;
