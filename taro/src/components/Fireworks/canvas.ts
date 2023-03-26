function getRandom(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

type renderList = {
  render;
  duration: number;
  timestamp: number;
}[];

class ThumbsUpAni {
  canvas;
  context;

  width;
  height;

  imgs;

  scanning = false;
  renderList = [] as renderList;
  scaleTime = 0.1; // 百分比

  constructor(props) {
    const { canvas, width, height, imgs } = props;

    this.width = width;
    this.height = height;

    canvas.width = width;
    canvas.height = height;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.imgs = this.createImage(imgs);
  }

  createImage(imgs) {
    const proms = imgs.map((i) => {
      return new Promise((resolve) => {
        const img = this.canvas.createImage();
        img.src = i;
        img.onload = () => {
          resolve(img);
        };
      });
    });

    return Promise.all(proms);
  }
  async createRender() {
    const imgs = await this.imgs;
    if (imgs.length == 0) return null;

    const basicScale = [0.6, 0.9, 1.2][getRandom(0, 2)];

    const getScale = (diffTime) => {
      if (diffTime < this.scaleTime) {
        return +(diffTime / this.scaleTime).toFixed(2) * basicScale;
      } else {
        return basicScale;
      }
    };

    const context = this.context;

    // 随机读取一个图片来渲染
    const image = imgs[getRandom(0, imgs.length - 1)];
    const offset = 20;
    const basicX = this.width / 2 + getRandom(-offset, offset);
    const angle = getRandom(2, 10);
    const ratio = getRandom(10, 30) * (getRandom(0, 1) ? 1 : -1);

    const getTranslateX = (diffTime) => {
      if (diffTime < this.scaleTime) {
        // 放大期间，不进行摇摆位移
        return basicX;
      } else {
        return basicX + ratio * Math.sin(angle * (diffTime - this.scaleTime));
      }
    };

    const getTranslateY = (diffTime) => {
      return (
        image.height / 2 + (this.height - image.height / 2) * (1 - diffTime)
      );
    };

    const fadeOutStage = getRandom(14, 18) / 100;
    const getAlpha = (diffTime) => {
      const left = 1 - +diffTime;
      if (left > fadeOutStage) {
        return 1;
      } else {
        return 1 - +((fadeOutStage - left) / fadeOutStage).toFixed(2);
      }
    };

    return (diffTime) => {
      // 差值满了，即结束了 0 ---》 1
      if (diffTime >= 1) return true;

      context.save();
      const scale = getScale(diffTime);
      // const rotate = getRotate();
      const translateX = getTranslateX(diffTime);
      const translateY = getTranslateY(diffTime);
      context.translate(translateX, translateY);
      context.scale(scale, scale);
      // context.rotate(rotate * Math.PI / 180);
      context.globalAlpha = getAlpha(diffTime);

      context.drawImage(
        image,
        -image.width / 2,
        -image.height / 2,
        image.width,
        image.height,
      );
      context.restore();
    };
  }
  scan() {
    this.context.clearRect(0, 0, this.width, this.height);
    let index = 0;
    let length = this.renderList.length;
    if (length > 0) {
      this.canvas.requestAnimationFrame(this.scan.bind(this));
      this.scanning = true;
    } else {
      this.scanning = false;
    }
    while (index < length) {
      const child = this.renderList[index];
      if (
        !child ||
        !child.render ||
        child.render.call(null, (Date.now() - child.timestamp) / child.duration)
      ) {
        // 结束了，删除该动画
        this.renderList.splice(index, 1);
        length--;
      } else {
        // continue
        index++;
      }
    }
  }
  async start() {
    const render = await this.createRender();
    const duration = getRandom(1500, 3000);
    this.renderList.push({
      render,
      duration,
      timestamp: Date.now(),
    });

    if (!this.scanning) {
      this.scanning = true;
      this.canvas.requestAnimationFrame(this.scan.bind(this));
    }

    return this;
  }
}
export default ThumbsUpAni;
