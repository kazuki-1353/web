export type Props = {
  id: string;
  width?: number;
  height?: number;
};

export type MouseEvent = (e: { x: number; y: number }) => void;

let CanvasPlus = class {
  constructor(public props: Props) {
    let { id, width, height } = props;

    let cvs = document.getElementById(id) as HTMLCanvasElement;
    cvs.width = width || document.documentElement.clientWidth;
    cvs.height = height || document.documentElement.clientHeight;

    this.cvs = cvs;
    this.ctx = cvs.getContext('2d');
    this.rect = cvs.getBoundingClientRect();
  }

  cvs: HTMLElement;
  ctx: CanvasRenderingContext2D;
  rect: DOMRect;

  onMouseMove = (fun: MouseEvent) => {
    let event = (e) => {
      let x = e.clientX - this.rect.x;
      let y = e.clientY - this.rect.y;

      fun({
        x,
        y,
      });
    };

    document.addEventListener('mousemove', event);
    return () => document.removeEventListener('mousemove', event);
  };
};

export default CanvasPlus;
