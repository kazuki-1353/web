/* 

import TimeCountdown from '../../utils/TimeCountdown';

new TimeCountdown({
  end: 5,
  onChange(res) {},
  onEnd() {},
});
new TimeCountdown({
  start: Date.now(),
  end: data.end,
  unit: 'ms',
  onChange(res) {},
  onEnd() {},
});

let countdown = new TimeCountdown();
countdown.stop();

*/

export type Result = {
  date: string;
  hour: string;
  minute: string;
  second: string;
};
export type Props = {
  /**开始时间 */ start?: number;
  /**结束时间 */ end: number;
  /**单位 */ unit?: 'ms' | 's';

  /**监听变化 */ onChange?: (res: Result) => void;
  /**监听结束 */ onEnd?: () => void;
};

export default class {
  constructor(public props: Props) {
    let { start = 0, end } = this.props;
    if (!end) throw new Error('TimeCountdown 工具缺失 end 参数');

    this.stop();

    let time = end - start;
    this.timer = setInterval(() => {
      this.run(time);
      time -= 1;
    }, 1000);
  }

  timer;
  stop = () => {
    clearInterval(this.timer);
  };

  run = (time) => {
    let { unit = 's', onChange, onEnd } = this.props;

    if (time > 0) {
      let base = unit === 's' ? 1 : 1000;

      /**天 */ let date = Math.floor(time / 86400 / base); /* 60*60*24 */
      /**时 */ let hour = Math.floor(time / 3600 / base) % 24; /* 60*60 */
      /**分 */ let minute = Math.floor(time / 60 / base) % 60;
      /**秒 */ let second = Math.floor(time / base) % 60;

      onChange &&
        onChange({
          date: `${date}`,
          hour: hour < 10 ? `0${hour}` : `${hour}`,
          minute: minute < 10 ? `0${minute}` : `${minute}`,
          second: second < 10 ? `0${second}` : `${second}`,
        });
    } else {
      this.stop();

      onEnd && onEnd();
      onChange &&
        onChange({
          date: '0',
          hour: '00',
          minute: '00',
          second: '00',
        });
    }
  };
}
