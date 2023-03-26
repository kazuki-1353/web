/**上传图片后本地显示 */
export default (input, dom) => {
  input.onchange = () => {
    let file = this.files[0];
    let imageType = /image.*/;
    let isImg = file.type.match(imageType);
    if (isImg) {
      let reader = new FileReader();
      reader.onload = () => {
        let img = new Image();
        img.src = reader.result;

        dom.append(img);
      };

      reader.readAsDataURL(file);
    } else {
      alert('您上传的不是图片');
    }
  };
};
