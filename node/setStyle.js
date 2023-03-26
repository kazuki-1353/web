let style = {
  /* 亮色 */ bright: '\x1B[1m',
  /* 灰色 */ grey: '\x1B[2m',

  /* 斜体 */ italic: '\x1B[3m',
  /* 下划线 */ underline: '\x1B[4m',
  /* 反向 */ reverse: '\x1B[7m',
  /* 隐藏 */ hidden: '\x1B[8m',
  /* 删除线 */ line: '\x1B[9m',

  /* 黑色 */ black: '\x1B[30m',
  /* 红色 */ red: '\x1B[31m',
  /* 绿色 */ green: '\x1B[32m',
  /* 黄色 */ yellow: '\x1B[33m',
  /* 蓝色 */ blue: '\x1B[34m',
  /* 品红 */ magenta: '\x1B[35m',
  /* 青色 */ cyan: '\x1B[36m',
  /* 白色 */ white: '\x1B[37m',

  /* 黑色背景 */ blackBG: '\x1B[40m',
  /* 红色背景 */ redBG: '\x1B[41m',
  /* 绿色背景 */ greenBG: '\x1B[42m',
  /* 黄色背景 */ yellowBG: '\x1B[43m',
  /* 蓝色背景 */ blueBG: '\x1B[44m',
  /* 品红背景 */ magentaBG: '\x1B[45m',
  /* 青色背景 */ cyanBG: '\x1B[46m',
  /* 白色背景 */ whiteBG: '\x1B[47m',
};

let setStyle = (text, color) => {
  let start = style[color] || '';
  let end = '\x1B[0m';
  return `${start}${text}${end}`;
};

let log = (text, color) => {
  let msg = setStyle(text, color);
  console.log(msg);
};

module.exports = setStyle;
module.exports.log = log;
module.exports.style = style;
