let time = null;

let click = (opt) => {
  let { id, element, tap, longtap, delay = 500 } = opt;

  let dom = element || document.getElementById(id);

  dom.addEventListener('touchstart', (e) => {
    e.preventDefault();

    time = setTimeout(() => {
      time = null;
      longtap && longtap(e);
    }, delay);
  });

  dom.addEventListener('touchmove', (e) => {
    e.preventDefault();

    clearTimeout(time);
    time = null;
  });

  dom.addEventListener('touchend', (e) => {
    e.preventDefault();

    if (time) {
      clearTimeout(time);
      time = null;
    } else {
      tap && tap(e);
    }
  });
};

export default click;
