let move = (e, x, y) => {
  let position = 'position:absolute;';
  let left = 'left:' + (e.pageX - x) + 'px;';
  let top = 'top:' + (e.pageY - y) + 'px;';
  this.setAttribute('style', position + left + top);
};

/**自由拖拽 */
let drag = (dom) => {
  let draggable = typeof dom === 'string' ? document.getElementById(dom) : dom;
  draggable.style.position = 'absolute';

  draggable.addEventListener('mousedown', (e) => {
    document.removeEventListener('mousemove', move);

    e.preventDefault();

    let x = e.layerX || e.offsetX;
    let y = e.layerY || e.offsetY;
    document.addEventListener('mousemove', move.bind(this, x, y));
  });

  document.addEventListener('mouseup', (e) => {
    document.removeEventListener('mousemove', move);
  });
};

export default drag;
