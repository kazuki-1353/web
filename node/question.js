let question = (str = '') => {
  return new Promise((resolve) => {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(str, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

module.exports = question;
