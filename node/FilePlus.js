let FilePlus = class {
  constructor(_path = process.argv.slice(2)) {
    this._getPath(_path);
    return this.getStat().then(() => this);
  }

  DIR;
  FILE;
  FILE_BASE_NAME;
  FILE_EXT_NAME;

  /**获取路径 */
  _getPath(_path) {
    if (!_path) return console.error('请输入文件路径');

    let str = _path instanceof Array ? _path.join(' ') : _path; //支持路径有空格

    // 判断是否为绝对路径
    if (path.isAbsolute(str)) {
      this.FILE = str;
    } else {
      this.FILE = path.join(__dirname, str);
    }

    this.FILE_BASE_NAME = path.basename(str);
    this.FILE_EXT_NAME = path.extname(str);
    this.DIR = path.dirname(this.FILE);
  }

  _stats;

  /**读取文件 */
  getStat() {
    if (this._stats) {
      return Promise.resolve(this._stats);
    } else {
      return new Promise((resolve, reject) => {
        fs.stat(this.FILE, (err, stats) => {
          if (err) {
            reject(err);
          } else {
            let isDirectory = stats.isDirectory();
            if (isDirectory) {
              reject(new Error('请输入文件路径'));
            } else {
              this._stats = stats;
              resolve(stats);
            }
          }
        });
      });
    }
  }

  /**读取文本 */
  readline({ onLine, onClose }) {
    let lineNumber = 0;

    return new Promise((resolve) => {
      let input = fs.createReadStream(this.FILE);
      let rl = readline.createInterface({
        input,
      });

      rl.on('line', (line) => {
        onLine(line, ++lineNumber, false);
      });

      rl.on('close', () => {
        onLine('', ++lineNumber, true); // 手动调用, 因为.on('line')无法获取最后一个空行
        onClose?.(lineNumber);
        resolve(lineNumber);
      });
    });
  }

  /**重命名文件/剪切文件/复制文件 */
  rename(target, isCopy) {
    let sourceParse = path.parse(this.FILE);
    let sourceDir = sourceParse.ext ? sourceParse.dir : source;

    let targetParse = path.parse(target);
    let targetDir = targetParse.ext ? targetParse.dir : target;

    let src;
    let isAbsolute = path.isAbsolute(target);
    if (isAbsolute) {
      src = targetDir;
    } else {
      let relative = path.relative(this.DIR, sourceDir);
      src = path.join(this.DIR, targetDir, relative);
    }

    let targetPath = path.join(
      src,
      targetParse.ext ? targetParse.base : sourceParse.base,
    );

    return new Promise((resolve, reject) => {
      if (targetPath === this.FILE) return resolve(targetPath); // 如果路径一致则直接跳过

      makeDir(src, this.DIR).then(() => {
        let fun = isCopy ? fs.copyFile : fs.rename;
        fun(this.FILE, targetPath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(targetPath);
          }
        });
      });
    });
  }

  /**备份文件 */
  backup() {
    /**备份目录名 */
    let target = path.join(this.DIR, BackupPath, `${Date.now()}`);
    return this.rename(target, true).then(() => {
      log('备份目录', target);
    });
  }

  /**获取备份目录 */
  getBackupDIR() {
    let dir = path.join(this.DIR, BackupPath);
    return (
      /* 输出所有备份目录 */
      readDir(dir).then((res) => {
        res.reverse();

        return res.map((item, index) => {
          let { name } = item;
          let date = new Date(+name);
          let time = date.toLocaleString();

          console.log(`${index}: ${time}`);

          return {
            path: path.join(dir, name),
            name,
            time,
          };
        });
      })
    );
  }

  /**还原文件 */
  restore() {
    let sourcePath;

    return new Promise((resolve) => {
      this.getBackupDIR().then((dirs) => {
        if (dirs.length) {
          console.log();
          question('请输入还原目录编号:')
            .then((answer) => {
              let dir = dirs[answer];
              if (dir) {
                sourcePath = dir.path;
                log('还原目录', sourcePath);
                return sourcePath;
              } else {
                console.log('无此目录编号');
                setTimeout(resolve);
                throw '';
              }
            })

            /* 获取备份文件 */
            .then((sourcePath) => {
              let src = path.join(sourcePath, this.FILE_BASE_NAME);
              return new FilePlus(src);
            })

            /* 还原文件 */
            .then((filePlus) => filePlus.rename(this.FILE, true))
            .then(resolve);
        } else {
          console.log('暂无还原目录');
          resolve();
        }
      });
    });
  }

  /**修改文件 */
  modify(fun, isBackup) {
    /**修改时间 */
    let time = Date.now();

    /**临时文件路径 */
    let tempFile = this.FILE + '.' + time;

    return new Promise((resolve, reject) => {
      let ws = fs.createWriteStream(tempFile);
      ws.on('close', resolve);
      ws.on('error', reject);

      fun(ws);
    })
      .then(async () => {
        if (isBackup) {
          let dir = path.join(this.DIR, BackupPath, `${time}`);
          return this.rename(dir); /* 移动到备份目录 */
        }
      })
      .then((dir) => {
        if (isBackup) log('备份目录', dir);

        /* 将临时文件改名为来源文件 */
        return fs.rename(tempFile, this.FILE, (err) => {
          if (err) Promise.reject(err);
        });
      });
  }
};
