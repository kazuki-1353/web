/*

import Htm2Image from '../components/Htm2Image';

<Htm2Image htm={HTM} width={} height={} onComplete={onComplete} />

 */

import React, {
  CSSProperties,
  FC,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';

const Comp: FC<{
  htm: Element;
  width: number;
  height: number;
  onComplete: (img: string) => void;
}> = memo((props) => {
  let { htm, width, height, onComplete } = props;

  let refCVS = useRef<HTMLCanvasElement>(null);
  let refCTX = useRef<CanvasRenderingContext2D>(null);

  /* 画布 */
  let drawContext = useCallback(() => {
    let ctx = refCTX.current;
    if (!ctx) return;

    let svg = `data:image/svg+xml,
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${width}"
        height="${height}"
      >
        <foreignObject
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <body
            xmlns="http://www.w3.org/1999/xhtml"
            style="margin:0;height:100%;"
          >
            ${htm}
          </body>
        </foreignObject>
      </svg>
    `
      .replace(/"/g, "'")
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E');

    ctx.drawImage(svg, 0, 0, width, height);
  }, [htm, width, height]);

  /* 转为图片 */
  let toDataURL = useCallback(() => {
    let cvs = refCVS.current;
    if (!cvs) return;

    let img = cvs.toDataURL('image/png', 1);
    return img;
  }, []);

  useEffect(() => {
    let cvs = refCVS.current;
    if (!cvs) return;

    cvs.width = width;
    cvs.height = height;

    refCTX.current = cvs.getContext('2d');
    if (!refCTX.current) return;

    drawContext();
    let img = toDataURL();
    onComplete(img);
  }, [width, height, drawContext, toDataURL, onComplete]);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      cvs: {
        width,
        height,
        verticalAlign: 'middle',
      },
    };
  }, [width, height]);

  return (
    <canvas ref={refCVS} style={css.cvs}>
      您的浏览器版本过旧
    </canvas>
  );
});

export default Comp;
