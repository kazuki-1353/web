/*

import TimeCountdownDayjs from '../../utils/TimeCountdownDayjs';

new TimeCountdown({
  end: 5,
  onChange(res) {},
  onEnd() {},
});
new TimeCountdownDayjs({
  start: Date.now(),
  end: data.end,
  unit: 'ms',
  onChange(res) {},
  onEnd() {},
});

let countdown = new TimeCountdownDayjs();
countdown.stop();

*/

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import toObject from 'dayjs/plugin/toObject';

export type Result = {
  // years: number;
  // months: number;
  dates: number;
  hours: number;
  minutes: number;
  seconds: number;

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
    dayjs.extend(utc);
    dayjs.extend(toObject);

    this.endDay = dayjs(props.end);
    this.currentDay = dayjs(props.start || 0);

    this.stop();
    this.timer = setInterval(() => this.run(), 1000);
  }

  currentDay: dayjs.Dayjs;
  endDay: dayjs.Dayjs;

  timer;
  stop = () => {
    clearInterval(this.timer);
  };

  run = () => {
    let { onChange, onEnd } = this.props;

    this.currentDay = this.currentDay.add(1, 's');

    // console.log('当前时间', this.currentDay.format());
    // console.log('结束时间', this.endDay.format());

    /* 判断是否到达时限 */
    if (this.currentDay.isAfter(this.endDay)) {
      this.stop();
      onEnd && onEnd();
    } else {
      let diffTime = this.endDay.diff(this.currentDay);
      let time = dayjs(diffTime).utc();

      onChange &&
        onChange({
          // years: this.endDay.diff(this.currentDay, 'year'),
          // months: this.endDay.diff(this.currentDay, 'month'),
          dates: this.endDay.diff(this.currentDay, 'day'),
          hours: this.endDay.diff(this.currentDay, 'hour'),
          minutes: this.endDay.diff(this.currentDay, 'minute'),
          seconds: this.endDay.diff(this.currentDay, 'second'),

          date: time.format('d'),
          hour: time.format('HH'),
          minute: time.format('mm'),
          second: time.format('ss'),
        });
    }
  };
}
