export const Base64ToBlob = (
  base64: string,
  contentType: string,
  sliceSize: number,
) => {
  let byteCharacters = atob(base64);
  let byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  let blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const Base64ToArrayBuffer = (base64: string) => {
  let binaryString = window.atob(base64);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
};

export const BlobToBase64 = (blob: Blob) => {
  return new Promise<FileReader['result']>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const BlobToArrayBuffer = (blob: Blob) => {
  return new Promise<FileReader['result']>((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject;
    reader.readAsArrayBuffer(blob);
  });
};

export const ArrayBufferToBase64 = (buffer: ArrayBuffer) => {
  // let binary = '';
  // let bytes = new Uint8Array(buffer);
  // let len = bytes.byteLength;

  // for (let i = 0; i < len; i++) {
  //   binary += String.fromCharCode(bytes[i]);
  // }

  let bytes = new Uint8Array(buffer);
  let binary = String.fromCharCode.apply(null, bytes);
  return window.btoa(binary);
};

export const ArrayBufferToBlob = (
  buffer: ArrayBuffer,
  byteOffset?: number,
  length?: number,
) => {
  let bytes = new Uint8Array(buffer, byteOffset, length);
  let blob = new Blob([bytes]);
  return blob;
};

export const ArrayBufferToString = (buffer: ArrayBuffer) => {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return binary;
};
