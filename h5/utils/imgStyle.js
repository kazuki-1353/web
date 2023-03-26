export default (htm, opt = {}) => {
  let { imgWidth = '100%', imgMiddle = true } = opt;

  let _htm = htm.replace(/(<img)(.*?)(\/?>)/gi, (match, g1, g2, g3) => {
    let style = `width:${imgWidth};${
      imgMiddle ? 'vertical-align:middle;' : ''
    }`;
    let str = `${g1}${g2} style="${style}" ${g3}`;
    return str;
  });

  return _htm;
};
