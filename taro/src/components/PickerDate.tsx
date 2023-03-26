/*

import PickerDate from '../../components/PickerDate';

onChange = (value) => {}

<PickerDate onChange={this.onPickerChange} />

start // 选择范围从当天开始
end // 选择范围到当天结束
start={} // 开始时间
end={} // 结束时间

format='YYYY/MM/DD'

unit='month'
unit='year'

iconL={this.IconL}
iconR={this.IconR}

*/

import React, {
  CSSProperties,
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import dayjs, { Dayjs } from 'dayjs';

import Taro from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';

let css: Record<string, CSSProperties> = {
  wrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  picker: {
    flex: 1,
    textAlign: 'center',
  },

  btn: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '0 10px',
  },

  icon: {
    position: 'relative',
    overflow: 'hidden',
    width: '0.5em',
    height: '1em',
  },
  iconL: {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '0.5em transparent solid',
    borderLeftWidth: 0,
    borderRightColor: 'currentColor',
  },
  iconR: {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '0.5em transparent solid',
    borderRightWidth: 0,
    borderLeftColor: 'currentColor',
  },
};

const Comp: FC<{
  value?: string | number;
  start?: string | number | boolean;
  end?: string | number | boolean;

  format?: string;
  unit?: 'day' | 'month' | 'year';

  iconL?: () => React.ReactChild;
  iconR?: () => React.ReactChild;

  onChange: (value: string) => void;
}> = (props) => {
  let { value, start, end, unit = 'day', iconL, iconR } = props;

  let [Day, setDay] = useState<Dayjs>();
  useEffect(() => {
    let day = dayjs(value);
    setDay(day);
  }, [value]);

  let format = useMemo(() => {
    switch (unit) {
      case 'year':
        return 'YYYY';

      case 'month':
        return 'YYYY-MM';

      case 'day':
        return 'YYYY-MM-DD';

      default:
        return 'YYYY-MM-DD';
    }
  }, [unit]);

  let limit = useMemo(() => {
    let getLimit = (time) => {
      if (!time) return '';

      switch (typeof time) {
        case 'string':
          return time;

        case 'number':
          return dayjs(time).format(format);

        case 'boolean':
          return dayjs().format(format);

        default:
          return '';
      }
    };

    return {
      start: getLimit(start),
      end: getLimit(end),
    };
  }, [start, end, format]);

  let btnStyle = useMemo(() => {
    let getStyle = (time): CSSProperties => {
      if (!Day) return css.btn;

      let Limit = dayjs(time);
      let isSame = Day.isSame(Limit, unit);

      return {
        ...css.btn,
        opacity: isSame ? 0.3 : 1,
        pointerEvents: isSame ? 'none' : 'auto',
      };
    };

    return {
      subtract: getStyle(limit.start),
      add: getStyle(limit.end),
    };
  }, [unit, limit, Day]);

  let onClick = useCallback(
    (mode: 'subtract' | 'add') => {
      if (!Day) return;

      let _day = Day[mode](1, unit);
      setDay(_day);
    },
    [unit, Day],
  );

  let onChange = useCallback((e) => {
    let _value = e.detail.value;
    let _day = dayjs(_value);
    setDay(_day);
  }, []);

  let dateValue = useMemo(() => Day?.format(format) || '', [Day, format]);
  let dateShow = useMemo(() => Day?.format(props.format || format) || '', [
    Day,
    format,
    props.format,
  ]);

  if (!Day) return null;
  if (!dateValue) return null;
  if (!dateShow) return null;

  console.log('日期', dateShow);
  props.onChange(dateShow);

  return (
    <View style={css.wrap}>
      <View style={btnStyle.subtract} onClick={onClick.bind(null, 'subtract')}>
        {iconL ? (
          iconL()
        ) : (
          <View style={css.icon}>
            <Text style={css.iconL} />
          </View>
        )}
      </View>

      <Picker
        style={css.picker}
        mode='date'
        fields={unit}
        start={limit.start}
        end={limit.end}
        value={dateValue}
        onChange={onChange}
      >
        {/* 如果不加标签H5只能切换一遍 */}
        <Text>{dateShow}</Text>
      </Picker>

      <View style={btnStyle.add} onClick={onClick.bind(null, 'add')}>
        {iconR ? (
          iconR()
        ) : (
          <View style={css.icon}>
            <Text style={css.iconR} />
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(Comp);
