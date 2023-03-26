/* 

time2str() // Y-M-D h:m:s
time2str(timestamp) // Y-M-D h:m:s



time2str({ OPT });
time2str(timestamp, { OPT });

// 格式化
format: '',
format: 'Y年',
format: 'M月',
format: 'D日',
format: 'Y年M月D日',
format: 'Y.M.D',
format: 'Y-M-D',
format: 'Y/M/D',
format: 'h:m:s',

// 指定时间与当前相差多少
differ: '',
differ: 'second',
differ: 'minute',
differ: 'hour',
differ: 'date',
differ: 'month',
differ: 'year',

*/

type Timestamp = string | number;

type Option = {
  /**格式化 */
  format?: string;

  /**指定时间与当前相差多少 */
  differ?: 'second' | 'minute' | 'hour' | 'date' | 'month' | 'year';
};

/**获取日期相差 */
let getDiffer = (timestamp: number, differ: Option['differ']) => {
  switch (differ) {
    /* 指定时间与当前相差的秒 */
    case 'second':
      return Math.ceil((Date.now() - timestamp) / 1000);

    /* 指定时间与当前相差的分 */
    case 'minute':
      return Math.ceil((Date.now() - timestamp) / 60000);

    /* 指定时间与当前相差的时 */
    case 'hour':
      return Math.ceil((Date.now() - timestamp) / 3600000);

    /* 指定时间与当前相差的日 */
    case 'date':
      return Math.ceil((Date.now() - timestamp) / 86400000);

    /* 指定时间与当前相差的月 */
    case 'month':
      return Math.ceil((Date.now() - timestamp) / 2592000000);

    /* 指定时间与当前相差的年 */
    case 'year':
      return Math.ceil((Date.now() - timestamp) / 31536000000);

    default:
      return;
  }
};

/**时间格式化 */
let format = (arr: string[], str: string) => {
  let obj = {
    Y: arr[0],
    M: arr[1],
    D: arr[2],
    h: arr[3],
    m: arr[4],
    s: arr[5],
  };

  let time = str.replace(
    /(.*?)(Y|M|D|h|m|s)(.*?)/g,
    (match, g1, g2, g3) => `${g1}${obj[g2]}${g3}`,
  );
  return time;
};

function time2str(): string;
function time2str(timestamp: Timestamp): string;
function time2str(timestamp: Timestamp, option: Option): string;
function time2str(option: Option): string;
function time2str(arg?, option?: Option) {
  let now: Date;

  switch (typeof arg) {
    case 'string':
    case 'number':
      if (option?.differ) {
        let differ = getDiffer(+arg, option.differ);
        return differ;
      }

      now = new Date(arg);
      break;

    case 'object':
      option = arg;
      now = new Date();
      break;

    default:
      now = new Date();
      break;
  }

  let nums = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  ];

  let strs = nums.map((i) => `${i < 10 ? 0 : ''}${i}`);

  if (option?.format) {
    return format(strs, option.format);
  } else {
    let date = `${strs[0]}-${strs[1]}-${strs[2]}`;
    let time = `${strs[3]}:${strs[4]}:${strs[5]}`;
    return `${date} ${time}`;
  }
}

export default time2str;
