/* 将图片转换为黑色的点阵图

import ImgLattice from '../components/ImgLattice';

<ImgLattice src={} />

width={}
height={}
gap={} // 点阵间隙
size={} // 点阵大小
hidden // 不显示图片

onLoad={} // 原图
onReady={} // 点阵图
onError={}

*/

import React, { PureComponent } from 'react';

class Comp extends PureComponent {
  componentDidMount() {
    let { src, onLoad, onReady, onError } = this.props;
    if (!src) return;

    this.loadImg()
      .then((img) => {
        onLoad?.(img);

        let lattice = this.createLattice(img);
        onReady?.(lattice);
      })
      .catch(onError);
  }
  // componentWillUnmount() {}

  loadImg() {
    let { src, width, height } = this.props;

    let cvs = this.ref.current;
    let ctx = cvs.getContext('2d');

    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;

      img.addEventListener('error', reject);
      img.addEventListener('load', () => {
        switch (false) {
          case !width: {
            let radix = img.width / img.height;
            height = Math.floor(width / radix);
            break;
          }

          case !height: {
            let radix = img.width / img.height;
            width = Math.floor(height * radix);
            break;
          }

          default: {
            width = img.width;
            height = img.height;
            break;
          }
        }

        cvs.width = width;
        cvs.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        let imageData = ctx.getImageData(0, 0, width, height);

        resolve({
          src,
          width,
          height,
          cvs,
          ctx,
          data: imageData.data,
        });
      });
    });
  }

  createLattice = (img) => {
    let { src, gap = 6, size = 4 } = this.props;
    let { width, height, cvs, ctx, data } = img;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    for (let h = 0; h < height; h += gap) {
      for (let w = 0; w < width; w += gap) {
        /**点阵位置 */
        let position = (width * h + w) * 4;

        let r = data[position];
        let g = data[position + 1];
        let b = data[position + 2];

        /**是否有色块 */
        let hasColor = r + g + b < 700;
        if (hasColor) {
          ctx.fillStyle = '#000';
          ctx.fillRect(w, h, size, size);
        }
      }
    }

    return {
      src,
      width,
      height,
      cvs,
      ctx,
      base64: cvs.toDataURL('image/jpeg'),
    };
  };

  ref = React.createRef();

  render() {
    let { hidden } = this.props;
    return <canvas hidden={hidden} ref={this.ref} />;
  }
}

export default Comp;
