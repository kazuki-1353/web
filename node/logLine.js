let readline = require('readline');

let { stdout } = process;

let lastLine = 0;
let logLine = (title, line = lastLine) => {
  readline.cursorTo(stdout, 0, line); //移动光标
  readline.clearLine(stdout, 0); //删除光标所在行
  console.log(title);

  if (lastLine <= line) lastLine = line + 1; //设置最后一行
  readline.cursorTo(stdout, 0, lastLine);
};

module.exports = logLine;
