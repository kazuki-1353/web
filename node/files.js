let fs = require('fs');
let path = require('path');

/**获取路径 */
let getDir = () => {
  /* 是否有路径参数 */
  let args = process.argv.slice(2);
  if (args.length) {
    let str = args.join(' '); //支持路径有空格

    // 判断是否为绝对路径
    if (path.isAbsolute(str)) {
      return str;
    } else {
      return path.join(__dirname, str);
    }
  } else {
    return __dirname;
  }
};

/**当前目录名 */
let DIR = getDir();

/**忽略文件 */
let isIgnore = (src, opt = {}) => {
  if (src === __filename) return true;

  let { exclude, include } = opt;

  if (exclude) {
    let isArray = Array.isArray(exclude);
    if (isArray) {
      return exclude.some((i) => src.match(i));
    } else {
      return src.match(exclude);
    }
  }

  if (include) {
    let isArray = Array.isArray(include);
    if (isArray) {
      return !include.some((i) => src.match(i));
    } else {
      return !src.match(include);
    }
  }
};

/**创建目录 */
let makeDir = (dir) => {
  return new Promise((resolve) => {
    let isAbsolute = path.isAbsolute(dir);
    let src = isAbsolute ? dir : path.join(DIR, dir);
    fs.access(src, (err) => {
      if (err) {
        let subName = path.dirname(dir);
        makeDir(subName).then(() => {
          fs.mkdir(src, () => resolve(src));
        });
      } else {
        resolve(src);
      }
    });
  });
};

/**读取目录 */
let readDir = (dir, opt) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, res) => {
      if (err) {
        reject(err);
      } else {
        let files = res.reduce((p, i) => {
          let file = {
            dir: DIR,
            relative: path.relative(DIR, dir),
            name: i,
            src: path.join(dir, i),
          };

          if (isIgnore(file.src, opt)) {
            return p;
          } else {
            return [...p, file];
          }
        }, []);

        resolve(files);
      }
    });
  });
};

/**读取文件 */
let getStat = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file.src, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          ...file,
          stat,
        });
      }
    });
  });
};

/**获取所有文件 */
let getFiles = (dir, opt) => {
  return readDir(dir, opt)
    .then((files) => {
      return files.map((i) => {
        return getStat(i).then((file) => {
          let isFile = file.stat.isFile();
          if (isFile) {
            return file;
          } else {
            return getFiles(file.src, opt);
          }
        });
      });
    })
    .then((proms) => Promise.all(proms))
    .then((res) => res.flat(Infinity));
  // .then((res) => {
  //   return res.reduce((p, i) => {
  //     if (Array.isArray(i)) {
  //       return [...p, ...i];
  //     } else {
  //       return [...p, i];
  //     }
  //   }, []);
  // })
};

/**复制文件 */
let copy = (source, target) => {
  return new Promise((resolve, reject) => {
    let sourceParse = path.parse(source);
    let sourceDir = sourceParse.ext ? sourceParse.dir : source;

    let targetParse = path.parse(target);
    let targetDir = targetParse.ext ? targetParse.dir : target;

    let src;
    let isAbsolute = path.isAbsolute(target);
    if (isAbsolute) {
      src = targetDir;
    } else {
      let relative = path.relative(DIR, sourceDir);
      src = path.join(DIR, targetDir, relative);
    }

    makeDir(src)
      .then(() => {
        let targetPath = path.join(
          src,
          targetParse.ext ? targetParse.base : sourceParse.base,
        );

        fs.copyFile(source, targetPath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(targetPath);
          }
        });
      })
      .catch(reject);
  });
};

module.exports.dir = DIR;
module.exports.getDir = getDir;
module.exports.makeDir = makeDir;
module.exports.readDir = readDir;
module.exports.getStat = getStat;
module.exports.getFiles = getFiles;
module.exports.copy = copy;
