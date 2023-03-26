import React, { CSSProperties, PureComponent } from 'react';

type Pieces = {
  position: number;
  width?: number | 'auto';
  height?: number | 'auto';
};

type OwnProps = {
  img: string;

  /**是否为纵向 */ vertical?: boolean;

  /**显示宽度 */ width?: number;
  /**显示高度 */ height?: number;
  /**容器内边距 */ padding?: number | string;
};
type OwnState = {
  pieces: Pieces[];
  scrollTop: number;
  scrollLeft: number;
  imgSize: {
    width: number;
    height: number;
  };
};

let Comp = class extends PureComponent<OwnProps, OwnState> {
  state = {
    pieces: [] as Pieces[],
    scrollTop: 0,
    scrollLeft: 0,
    imgSize: {
      width: 0,
      height: 0,
    },
  };

  componentDidMount() {
    this.getImgSize().then(imgSize => {
      let { vertical, width, height } = this.props;

      let size = vertical ? height : width;
      if (!size) throw new Error(`缺失${vertical ? '高度' : '宽度'}`);

      let piece = Math.floor(size / 4);
      let piecesWidth = this.getPiecesSize(size - piece, piece, [piece]);
      let pieces = this.getPieces(piecesWidth);
      this.setState({
        pieces,
        imgSize,
      });
    });
  }

  getImgSize = () => {
    return new Promise<OwnState['imgSize']>((resolve, reject) => {
      let { img, vertical, width, height } = this.props;
      let image = new Image();
      image.addEventListener('error', reject);
      image.addEventListener('load', e => {
        let target = e.target as HTMLImageElement;

        if (vertical) {
          /* 纵向并指定宽度 */
          if (width) {
            let ratio = target.height / target.width;
            resolve({
              height: Math.round(width * ratio),
              width,
            });
            return;
          }
        } else {
          /* 横向并指定高度 */
          if (height) {
            let ratio = target.width / target.height;
            resolve({
              width: Math.round(height * ratio),
              height,
            });
            return;
          }
        }

        /* 没有指定高宽 */
        resolve({
          width: target.width,
          height: target.height,
        });
      });

      image.src = img;
    });
  };

  getPiecesSize = (
    size: number,
    piece: number,
    left: number[] = [],
    right: number[] = [],
  ): number[] => {
    piece = Math.floor(piece / 2) || 1;

    /* 数组左侧 */
    if (size > 0) {
      left.push(piece);
      size -= piece;
    }

    /* 数组右侧 */
    if (size > 0) {
      right.push(piece);
      size -= piece;
    }

    if (size > 0) {
      return this.getPiecesSize(size, piece, left, right);
    } else {
      left.reverse();
      return [...left, ...right];
    }
  };

  getPieces = (piecesSize: number[]) => {
    let { vertical } = this.props;

    let position = 0;
    return piecesSize.map(v => {
      let item: Pieces = {
        position,
      };

      if (vertical) {
        item.height = v;
      } else {
        item.width = v;
      }

      position = position - v;
      return item;
    });
  };

  onScroll = (e: React.UIEvent) => {
    let { scrollTop, scrollLeft } = e.target as HTMLElement;
    this.setState({
      scrollTop,
      scrollLeft,
    });
  };

  renderPieces = () => {
    let { pieces, scrollTop, scrollLeft, imgSize } = this.state;
    if (!pieces.length) return null;

    let { img, vertical } = this.props;

    return pieces.map(i => {
      let style = vertical
        ? {
            width: imgSize.width,
            height: i.height,
            backgroundImage: `url(${img})`,
            backgroundSize: `${imgSize.width}px auto`,
            backgroundPositionY: i.position - scrollTop,
          }
        : {
            width: i.width,
            height: imgSize.height,
            backgroundImage: `url(${img})`,
            backgroundSize: `auto ${imgSize.height}px`,
            backgroundPositionX: i.position - scrollLeft,
          };

      return <div style={style} key={i.position} />;
    });
  };

  getCss = () => {
    let { vertical, width, height, padding = 10 } = this.props;

    let css: {
      [key: string]: CSSProperties;
    } = {
      wrap: {
        position: 'relative',
        padding,
      },
      box: {
        display: 'flex',
      },
      cover: {
        position: 'absolute',
      },
    };

    if (vertical) {
      if (!height) throw new Error('缺失高度');

      css.wrap.overflowX = 'hidden';
      css.wrap.overflowY = 'auto';
      css.wrap.height = height * 2;
      css.box.marginTop = height * 1.5;
      css.box.height = height * 2.5;
    } else {
      if (!width) throw new Error('缺失宽度');

      css.wrap.overflowX = 'auto';
      css.wrap.overflowY = 'hidden';
      css.wrap.width = width * 2;
      css.box.marginLeft = width * 1.5;
      css.box.width = width * 2.5;
    }

    return css;
  };

  render() {
    let { children } = this.props;
    let css = this.getCss();

    return (
      <div style={css.wrap} onScroll={this.onScroll}>
        <div style={css.box}>
          {this.renderPieces()}

          <div style={css.cover}>{children}</div>
        </div>
      </div>
    );
  }
};

export default Comp;
