const http = require('http');
const path = require('path');
const fs = require('fs');

const config = {
  root: 'dist', // 目录
  port: 5555, // 端口
};

// 获取目录
const argv = process.argv.slice(2);
const root = path.join(__dirname, argv[0] || config.root);

http
  .createServer((req, res) => {
    res.writeHead(200);

    const myUrl = req.url;

    /** 判断是否请求文件 */
    const ext = path.extname(myUrl);
    if (ext) {
      const myPath = path.join(root, myUrl);
      const rs = fs.createReadStream(myPath);
      rs.pipe(res);
      rs.on('error', (err) => {
        res.writeHead(404, 'Not Found');
        res.end();
        console.error(err);
      });
    } else {
      const myPath = path.join(root, 'index.html');
      const body = fs.readFileSync(myPath);
      res.write(body);
      res.end();
    }
  })
  .listen(config.port, () => {
    console.log(`http://localhost:${config.port}`);
  });
