/* 图片剪切

<ImageCropper
  show={showCropper}
  onConfirm={onCropperConfirm}
  onCancel={setShowCropper.bind(this,false)}
/>

let [showCropper, setShowCropper] = useState(false);
let onCropperConfirm = useCallback((e) => {
  let { detail } = e;
  setShowCropper(false)
}, []);

*/

import { memo, useCallback, useMemo, useRef, useState } from 'react';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

let theme = {
  green: '#04b00f',
  red: '#C20C0C',
  yellow: '#F0C040',
};

let css = {
  wrap: {
    position: 'fixed',
    zIndex: 999,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: '#000',
  },

  buttons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    boxSizing: 'border-box',
    padding: '0 10px',
    height: '50px',
    lineHeight: '50px',
    color: '#fff',
  },

  button: {
    padding: '0 12px',
    height: '30px',
    lineHeight: '30px',
    borderRadius: '2px',
    textAlign: 'center',
    color: '#ffffff',
    cursor: 'pointer',
  },

  input: {
    display: 'none',
  },

  img: {
    display: 'block',
    maxWidth:
      '100%' /* This rule is very important, please don't ignore this */,
  },
};

const Comp = (props) => {
  let [src, setSrc] = useState();
  let reader = useMemo(() => {
    let _reader = new FileReader();
    _reader.addEventListener('load', (e) => {
      let { result } = e.target;
      setSrc(result);
    });

    return _reader;
  }, []);
  let onChange = useCallback(
    (e) => {
      let [file] = e.target.files;
      reader.readAsDataURL(file);
    },
    [reader],
  );

  let refImg = useRef(null);
  let [cropper, setCropper] = useState();
  let onLoad = useCallback(() => {
    let _cropper = new Cropper(refImg.current, {
      aspectRatio: 1,
    });
    setCropper(_cropper);
  }, []);

  let onConfirm = useCallback(() => {
    let cvs = cropper.getCroppedCanvas();
    cvs.toBlob((blob) => {
      // let formData = new FormData();
      // formData.append('croppedImage', blob);

      let url = URL.createObjectURL(blob);
      props.onConfirm(url);
    });
  }, [props, cropper]);

  return (
    <div style={css.wrap}>
      <img style={css.img} ref={refImg} src={src} alt='' onLoad={onLoad} />

      <div
        style={{
          ...css.buttons,
          color: theme.green,
        }}
      >
        <div style={css.button} onClick={props.onCancel}>
          取消
        </div>

        <label style={css.button} bindtap='upload'>
          选择图片
          <input
            style={css.input}
            id='file'
            type='file'
            name='img'
            accept='image/*'
            onChange={onChange}
          />
        </label>

        <div
          style={{
            ...css.button,
            background: theme.green,
          }}
          onClick={onConfirm}
        >
          确定
        </div>
      </div>
    </div>
  );
};

export default memo(Comp);
