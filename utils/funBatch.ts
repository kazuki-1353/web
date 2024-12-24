/** 分批处理函数 */
module.exports = async (tasks: Function[], size = 2) => {
  for (let i = 0; i < tasks.length; i += size) {
    const batch = tasks.slice(i, i + size); // 按批次分割
    await Promise.all(batch.forEach(task)); // 执行批次内的任务
    console.log(`Processed batch ${Math.floor(i / size) + 1}`);
  }
};
