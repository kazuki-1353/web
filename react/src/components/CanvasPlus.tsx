/*

import CanvasPlus, { IConfig } from '../components/CanvasPlus';

let data: IConfig = {
  width: 1500,
  height: 1500,

  blocks: [{}],
  images: [{}],
  texts: [{}],
};

<CanvasPlus data={data} />

onSuccess={onSuccess}
onFail={onFail}

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

export type IConfig = {
  width: number;
  height: number;
  backgroundColor?: CSSProperties['backgroundColor'];

  blocks?: IBlock[];
  images?: IImage[];
  texts?: IText[];
};

export type IBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderWidth?: number;
  borderRadius?: number;
  borderColor?: CSSProperties['borderColor'];
  backgroundColor?: CSSProperties['backgroundColor'];
  backgroundImage?: CSSProperties['backgroundImage'];
};

export type IImage = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: CSSProperties['borderColor'];
};

export type IText = {
  x: number;
  y: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
} & ITextProps &
  (
    | {
        text: string;
        texts?: undefined;
        fontSize: number;
        lineNumber?: number;
        width?: number;
      }
    | {
        text?: undefined;
        texts: Array<
          {
            text: string;
            fontSize?: number;
            marginLeft?: number;
            marginRight?: number;
          } & ITextProps
        >;
        fontSize?: number;
        lineNumber?: undefined;
        width?: undefined;
      }
  );
export type ITextProps = {
  textDecoration?: 'line-through' | 'none';
  fontFamily?: CSSProperties['fontFamily'];
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: CSSProperties['borderColor'];
  color?: CSSProperties['color'];
  backgroundColor?: CSSProperties['backgroundColor'];
  backgroundImage?: CSSProperties['backgroundImage'];
};

const Comp: FC<{
  data: IConfig;
  onSuccess?: (img: string) => void;
  onFail?: (err: Error) => void;
}> = memo((props) => {
  let { data, onSuccess, onFail } = props;

  let refCVS = useRef<HTMLCanvasElement>(null);
  let refCTX = useRef<CanvasRenderingContext2D>(null);

  /* 文本长度 */
  let getTextWidth = useCallback(
    (opt: { text: string; fontFamily?: string; fontSize?: number }) => {
      let ctx = refCTX.current;
      if (!ctx) return 0;

      let { text, fontSize, fontFamily = 'Arial' } = opt;
      if (!text) return 0;

      /* 获取文本长度前必须设置字体属性 */
      if (fontSize) ctx.font = `${fontSize}px ${fontFamily}`;

      let measureText = ctx.measureText(text);
      let width = Math.ceil(measureText.width);
      return width;
    },
    [],
  );

  /* 圆角 */
  let drawRadius = useCallback((opt: IBlock) => {
    let ctx = refCTX.current;
    if (!ctx) return;

    let { x, y, width, height, borderRadius = 0 } = opt;

    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    ctx.beginPath();
    ctx.moveTo((x2 - x1) / 2, y1);
    ctx.lineTo(x2 - borderRadius, y1);
    ctx.arcTo(x2, y, x2, y1 + borderRadius, borderRadius);
    ctx.lineTo(x2, y2 - borderRadius);
    ctx.arcTo(x2, y2, x2 - borderRadius, y2, borderRadius);
    ctx.lineTo(x1 + borderRadius, y2);
    ctx.arcTo(x1, y2, x1, y2 - borderRadius, borderRadius);
    ctx.lineTo(x1, y1 + borderRadius);
    ctx.arcTo(x1, y1, x1 + borderRadius, y1, borderRadius);
    ctx.closePath();
  }, []);

  /* 区块 */
  let drawBlock = useCallback(
    (opt: IBlock) => {
      return new Promise<void>((resolve, reject) => {
        let ctx = refCTX.current;
        if (!ctx) return reject();

        let {
          x,
          y,
          width,
          height,
          borderRadius = 0,
          borderWidth,
          borderColor,
          backgroundColor,
        } = opt;

        if (!width) return resolve();
        if (!height) return resolve();

        /* 是否有圆角 */
        if (borderRadius) {
          drawRadius(opt);
        } else {
          ctx.rect(x, y, width, height);
        }

        if (borderWidth) {
          ctx.lineWidth = borderWidth;
        }

        /* 背景色 */
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fill();

          ctx.strokeStyle = backgroundColor;
          ctx.stroke();
        }

        /* 边框色 */
        if (borderColor) {
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }

        resolve();
      });
    },
    [drawRadius],
  );
  let drawBlocks = useCallback(() => {
    let ctx = refCTX.current;
    if (!ctx) return Promise.reject();

    if (data.blocks) {
      let proms = data.blocks?.map(drawBlock);
      return Promise.all(proms).then(() => {});
    } else {
      return Promise.resolve();
    }
  }, [data, drawBlock]);

  /* 图片 */
  let drawImage = useCallback(
    (opt: IImage) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = opt.src;
        img.width = opt.width;
        img.height = opt.height;
        img.onerror = reject;
        img.onload = () => resolve(img);
      }).then((img) => {
        let ctx = refCTX.current;
        if (!ctx) return;

        if (opt.borderRadius) {
          ctx.save();

          drawRadius(opt);
          ctx.clip();
          ctx.drawImage(img, opt.x, opt.y, img.width, img.height);

          ctx.restore();
        } else {
          ctx.drawImage(img, opt.x, opt.y, img.width, img.height);
        }
      });
    },
    [drawRadius],
  );
  let drawImages = useCallback(() => {
    let ctx = refCTX.current;
    if (!ctx) return Promise.reject();

    if (data.images) {
      let proms = data.images?.map(drawImage);
      return Promise.all(proms).then(() => {});
    } else {
      return Promise.resolve();
    }
  }, [data, drawImage]);

  /* 文字 */
  let drawText = useCallback(
    async (opt: IText) => {
      let ctx = refCTX.current;
      if (!ctx) return Promise.reject();

      let {
        x,
        y,
        text,
        textAlign = 'left',
        textBaseline = 'top',
        fontFamily = 'Arial',
        fontSize = 16,
        color = '#000',
        width: maxWidth,
        lineHeight,
        paddingLeft = 0,
        paddingRight = 0,
        borderWidth = 0,
        backgroundColor,
        backgroundImage,
      } = opt;
      if (!text) return Promise.reject();

      let width = 0;
      let height = lineHeight || fontSize;
      if (maxWidth) {
        width = maxWidth + paddingLeft + paddingRight;
      } else {
        width =
          getTextWidth({
            text,
            fontFamily,
            fontSize,
          }) +
          paddingLeft +
          paddingRight;
      }

      /* 边框与背景 */
      if (borderWidth || backgroundColor) {
        await drawBlock({
          ...opt,
          width,
          height,
        });
      }

      /* 背景图 */
      if (backgroundImage) {
        await drawImage({
          src: backgroundImage,
          x,
          y,
          width,
          height,
        });
      }

      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;

      let offsetX = 0;
      switch (textAlign) {
        case 'left':
          offsetX = paddingLeft;
          break;

        case 'right':
          offsetX = -paddingRight;
          break;

        case 'center':
          offsetX = (width - paddingLeft - paddingRight) / 2 + paddingLeft;
          break;

        default:
          break;
      }

      let offsetY = 0;
      if (lineHeight) {
        offsetY = (lineHeight - fontSize) / 2;
      }

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.fillText(text, x + offsetX, y + offsetY);

      /* 如果有装饰线 */
      switch (opt.textDecoration) {
        case 'line-through': {
          let offsetLine = 0;
          switch (textBaseline) {
            case 'top':
              offsetLine = Math.ceil(fontSize / 2) + offsetY;
              break;

            case 'bottom':
              offsetLine = -Math.ceil(fontSize / 2) + offsetY;
              break;

            case 'middle':
              offsetLine = offsetY;
              break;

            case 'alphabetic':
              offsetLine = -Math.ceil(fontSize / 3) + offsetY;
              break;

            default:
              break;
          }

          ctx.beginPath();
          ctx.moveTo(x + paddingLeft, y + offsetLine);
          ctx.lineTo(
            x +
              paddingLeft +
              getTextWidth({
                text,
                fontFamily,
                fontSize,
              }),
            y + offsetLine,
          );
          ctx.closePath();

          ctx.lineWidth = Math.ceil(fontSize / 15);
          ctx.strokeStyle = color;
          ctx.stroke();
          break;
        }

        default:
          break;
      }

      return Promise.resolve();
    },
    [getTextWidth, drawBlock, drawImage],
  );
  let drawTexts = useCallback(() => {
    let ctx = refCTX.current;
    if (!ctx) return Promise.reject();

    if (data.texts) {
      let proms = data.texts?.map((i) => {
        if (i.text) {
          let { lineHeight, lineNumber = 1, width } = i;

          /* 判断是否限制范围 */
          if (width) {
            let texts = i.text.split('').reduce(
              (p, c) => {
                let last = p[p.length - 1];

                let charWidth = getTextWidth({
                  ...i,
                  text: c,
                });

                /* 判断是否超出范围 */
                if (width && width < last.width + charWidth) {
                  return [
                    ...p,
                    {
                      text: c,
                      width: charWidth,
                    },
                  ];
                } else {
                  last.text += c;
                  last.width += charWidth;
                  return p;
                }
              },
              [{ text: '', width: 0 }],
            );

            let _proms = texts.map((obj, index) => {
              let { text } = obj;

              /* 判断是否超出行数 */
              if (texts.length > lineNumber) {
                /* 超出行数时终止 */
                if (index >= lineNumber) return Promise.resolve();

                /* 最后2个字替换为省略号 */
                if (index === lineNumber - 1) {
                  text = obj.text.replace(/^(.+)([^.]{2})$/, '$1...');
                }
              }

              let offset = (lineHeight || i.fontSize) * index;
              return drawText({
                ...i,
                text,
                y: i.y + offset,
              });
            });

            return Promise.all(_proms).then(() => {});
          } else {
            return drawText(i);
          }
        }

        if (i.texts) {
          let totalX = i.x;
          let _proms = i.texts.map((o) => {
            let { marginLeft = 0, marginRight = 0 } = o;
            let x = totalX + marginLeft;

            let fontFamily = o.fontFamily || i.fontFamily;
            let fontSize = o.fontSize || i.fontSize;
            let width = getTextWidth({
              text: o.text,
              fontFamily,
              fontSize,
            });

            totalX = x + width + marginRight;

            return drawText({
              ...o,
              ...i,
              x,
            });
          });

          return Promise.all(_proms).then(() => {});
        }

        return Promise.reject();
      });

      return Promise.all(proms).then(() => {});
    } else {
      return Promise.resolve();
    }
  }, [data, getTextWidth, drawText]);

  /* 画布 */
  let drawContext = useCallback(() => {
    let ctx = refCTX.current;
    if (!ctx) return Promise.reject();

    return drawBlock({
      x: 0,
      y: 0,
      ...data,
    });
  }, [data, drawBlock]);

  /* 转为图片 */
  let toDataURL = useCallback(() => {
    let cvs = refCVS.current;
    if (!cvs) return Promise.reject();

    let img = cvs.toDataURL('image/png', 1);
    return Promise.resolve(img);
  }, []);

  useEffect(() => {
    let cvs = refCVS.current;
    if (!cvs) return;

    cvs.width = data.width;
    cvs.height = data.height;

    refCTX.current = cvs.getContext('2d');
    if (!refCTX.current) return;

    drawContext()
        .then(drawBlocks)
        .then(drawImages)
        .then(drawTexts)
        .then(toDataURL)
      .then(onSuccess)
      .catch(onFail);
  }, [
    data,
    drawContext,
    drawBlocks,
    drawImages,
    drawTexts,
    toDataURL,
    onSuccess,
    onFail,
  ]);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        width: '100%',
        height: '100%',
      },
      cvs: {
        width: '100%',
        height: '100%',
        verticalAlign: 'middle',
      },
    };
  }, []);

  return (
    <div style={css.wrap}>
      <canvas ref={refCVS} style={css.cvs}>
        您的浏览器版本过旧
      </canvas>
    </div>
  );
});

export default Comp;
