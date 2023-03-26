/**移除目录 */
module.exports = function rmDir(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (err) {
        /* 该目录不存在 */
        resolve();
      } else {
        if (stat.isFile()) {
          fs.unlink(dir, (err2) => {
            if (err2) {
              reject(err2);
            } else {
              resolve();
            }
          });
        } else {
          fs.readdir(dir, (err2, dirs) => {
            if (err2) {
              reject(err2);
            } else {
              let proms = dirs.map((i) => {
                let src = path.join(dir, i);
                return rmDir(src);
              });
              Promise.all(proms).then(() => {
                fs.rmdir(dir, (err3) => {
                  if (err3) {
                    reject(err3);
                  } else {
                    resolve();
                  }
                });
              });
            }
          });
        }
      }
    });
  });
};
