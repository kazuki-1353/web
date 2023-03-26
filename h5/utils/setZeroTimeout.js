let timeouts = [];
let id = Symbol('ZeroTimeoutID');

window.addEventListener(
  'message',
  (e) => {
    if (e.source !== window) return;
    if (e.data !== id) return;
    if (timeouts.length === 0) return;

    e.stopPropagation();

    let fun = timeouts.shift();
    fun();
  },
  true,
);

// 保持 setTimeout 的形态，只接受单个函数的参数，延迟始终为 0。
export default function setZeroTimeout(fun) {
  timeouts.push(fun);
  window.postMessage(id, '*');
}
