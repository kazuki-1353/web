/* 集群, 把数组均分到每个进程执行任务

let clusterPlus = require('./clusterPlus');

clusterPlus([], (tasks) => {});

// 异步
clusterPlus([], (tasks) => {
  return new Promise((resolve) => {});
});

*/

let os = require('os');
let cluster = require('cluster');

type Work<T> = {
  worker: Worker;
  tasks: T[];
};

let clusterPlus = <T = any>(
  list: T[],
  fun: (tasks: T[], id: number) => void | Promise<void>,
) => {
  // 判断当前文件是否在主进程上面加载的
  if (cluster.isMaster) {
    console.log('主进程开始');

    let cpus = os.cpus();

    let works: Work<T>[] = Array.from(
      {
        // 资源数小于CPU数时创建一个进程, 否则创建多个进程
        length: list.length < cpus.length ? 1 : cpus.length,
      },
      () => ({
        worker: cluster.fork(), //创建工作进程
        tasks: [],
      }),
    );

    // 平均分配任务
    if (works.length > 1) {
      list.forEach((item, index) => {
        works[index % cpus.length].tasks.push(item);
      });
    } else {
      works[0].tasks = list;
    }

    let worksProm = works.map((work) => {
      return new Promise<void>((resolve) => {
        let { worker, tasks } = work;

        // 发送任务到每个工作进程
        worker.send(work);

        // 接收任务完成
        worker.on('message', (msg) => {
          console.log('子进程结束', msg);
          resolve();
        });
      });
    });

    // 所有任务执行完毕
    Promise.all(worksProm).then(() => {
      console.log('主进程结束');
      cluster.disconnect(); // 关闭进程
    });
  } else {
    // 在主进程里执行 cluster.fork 之后被执行的工作进程
    process.on('message', async (work: Work<T>) => {
      let { worker, tasks } = work;
      console.log('子进程开始', worker.id);

      await fun(tasks, worker.id);
      process.send?.(worker.id); // 发送结果
    });
  }
};

module.exports = clusterPlus;
