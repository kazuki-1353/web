function insertScript(src: string, noCache = false) {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', () => {
      let script = document.createElement('script');
      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);

      script.type = 'text/javascript';
      script.async = true;
      script.src = src;

      /* 禁止缓存 */
      if (noCache) {
        let sign = src.includes('?') ? '&' : '?';
        script.src += `${sign}t=${Date.now()}`;
      }

      let firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    });
  });
}

export default insertScript;
