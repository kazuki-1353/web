/**鼠标滚轮换页 */
let Wheel = class {
  constructor(props) {
    let { element, page } = props;

    this.page = page;
    this.dom =
      typeof element === 'string' ? document.getElementById(element) : element;

    document.addEventListener('DOMMouseScroll', this.mouseWheel);
    document.addEventListener('mousewheel', this.mouseWheel);
  }

  count = 0;

  scrollWheel(dir) {
    let count = (this.count += dir);
    if (count < 0) {
      count = 0;
    } else if (count > this.page) {
      count = this.page;
    }

    dom.style.marginTop = -100 * count + 'vh';
  }

  mouseWheel(e) {
    if (e.wheelDelta == 120 || e.detail == -3) {
      this.scrollWheel(-1);
    } else if (e.wheelDelta == -120 || e.detail == 3) {
      this.scrollWheel(1);
    } else {
      this.scrollWheel(0);
    }
  }
};

export default Wheel;
