/* 

import SelectTime from '../../components/SelectTime';

<SelectTime onChange={this.onTimeChange} />

//已出租
rented={}

//不可选
disabled={}

*/

import React, { memo, useState, useEffect } from 'react';

import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';

import Taro, { FC } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import css from './SelectTime.module.scss';

let types = [
  {
    name: '可选',
    type: 'enabled',
  },
  {
    name: '已选择',
    type: 'selected',
  },
  {
    name: '已出租',
    type: 'rented',
  },
  {
    name: '不可选',
    type: 'disabled',
  },
];

let times = [
  ['00:00', '04:00'],
  ['04:00', '08:00'],
  ['08:00', '12:00'],
  ['12:00', '16:00'],
  ['16:00', '20:00'],
  ['20:00', '24:00'],
];

type Period = { start: number; end: number };
type Block = {
  id: number;
  start: string;
  end: string;
  type: 'enabled' | 'selected' | 'rented' | 'disabled';
};

/* 将时间戳转换为索引数组 */
let stamp2index = (arr: Period[]) => {
  if (!arr?.length) return [];

  let minutes = arr.map((i) => {
    let start = dayjs.unix(i.start);
    let end = dayjs.unix(i.end);

    /* 获取当天凌晨的时间对象 */
    let smallHours = start.startOf('d');

    /* 计算相差分钟数 */
    let startDiff = start.diff(smallHours, 'm') / 10;
    let endDiff = end.diff(smallHours, 'm') / 10;

    return {
      start: startDiff,
      end: endDiff,
    };
  });

  /* 获取该范围内所有索引值 */
  let indexes = minutes.reduce((p, i) => {
    let range = Array.from({ length: i.end - i.start }, (v, k) => i.start + k);

    return [...p, ...range];
  }, []);

  return indexes;
};

const Comp: FC<{
  rented: Period[];
  disabled: Period[];
  onChange: (e?: { start?: string; end?: string }) => void;
}> = (props) => {
  let { rented, disabled, onChange } = props;

  let [blocks, setBlocks] = useState<Block[]>([]);
  let [selected, setSelected] = useState<[Block?, Block?]>([]);

  useEffect(() => {
    dayjs.extend(objectSupport);
  }, []);

  /* 绘制时间块 */
  useEffect(() => {
    /* 重置已选择 */
    setSelected([]);

    let _blocks = Array.from({ length: 144 }, (_, id) => {
      let time = dayjs({
        m: id * 10,
      });

      let item: Block = {
        id,
        start: time.format('HH:mm'),
        end: time.add(10, 'm').format('HH:mm'),
        type: 'enabled',
      };

      /* 不可选 */
      stamp2index(disabled).forEach((i) => {
        if (id === i) item.type = 'disabled';
      });

      /* 已出租 */
      stamp2index(rented).forEach((i) => {
        if (id === i) item.type = 'rented';
      });

      return item;
    });

    setBlocks(_blocks);
  }, [rented, disabled]);

  /**选择时间块 */
  let onSelect = (e) => {
    let { id } = e.target.dataset;
    if (id === undefined) return;

    let item = blocks.find((i) => {
      if (i.id !== id) return false;
      if (i.type === 'disabled') return false;
      if (i.type === 'rented') return false;

      return true;
    });

    if (!item) return;

    let _selected = getSelected(item);
    let [start, end] = _selected;
    let startID = start ? start.id : NaN;
    let endID = end ? end.id : NaN;

    let isStop = getBlocks(startID, endID);
    if (isStop) return;

    setSelected(_selected);
  };
  let getSelected = (current): [Block?, Block?] => {
    let [start, end] = selected;
    let startID = start ? start.id : NaN;
    let endID = end ? end.id : NaN;

    let currentID = current.id;

    switch (selected.length) {
      case 0: {
        return [current];
      }

      case 1: {
        switch (true) {
          case currentID < startID:
            return [current, start];

          case currentID === startID:
            return [];

          case currentID > startID:
            return [start, current];

          default:
            return [];
        }
      }

      case 2: {
        switch (true) {
          case currentID < startID:
            return [current, start];

          case currentID === startID:
            return [end];

          case currentID === endID:
            return [start];

          default:
            return [start, current];
        }
      }

      default: {
        return [];
      }
    }
  };
  let getBlocks = (startID, endID) => {
    let isStop = false;

    let _blocks = blocks.map((i) => {
      switch (true) {
        case isStop:
          break;

        /* 选中区域 */
        case i.id > startID && i.id < endID: {
          switch (i.type) {
            /* 如果中间存在已出租或不可选则中断 */
            case 'rented':
            case 'disabled':
              isStop = true;
              break;

            case 'enabled':
              i.type = 'selected';
              break;

            default:
              break;
          }
          break;
        }

        /* 高亮选择 */
        case i.id === startID:
        case i.id === endID: {
          i.type = 'selected';
          break;
        }

        /* 取消选择 */
        case i.type === 'selected':
          i.type = 'enabled';
          break;

        default: {
          break;
        }
      }

      return i;
    });

    if (isStop) {
      return true;
    } else {
      setBlocks(_blocks);
      return false;
    }
  };

  /* 冒泡事件 */
  useEffect(() => {
    switch (selected.length) {
      case 1: {
        let { start, end } = selected[0] as Block;
        if (end === '00:00') end = '24:00';
        onChange({ start, end });
        break;
      }

      case 2: {
        let { start } = selected[0] as Block;
        let { end } = selected[1] as Block;
        if (end === '00:00') end = '24:00';
        onChange({ start, end });
        break;
      }

      default: {
        onChange({});
        break;
      }
    }
  }, [onChange, selected]);

  if (!blocks?.length) return null;
  return (
    <View className={css.wrap}>
      <View className={css.types}>
        {types.map((i) => (
          <View className={css.types__item} key={i.name}>
            <Text
              className={[css.types__block, css[`block--${i.type}`]].join(' ')}
            />
            <Text className={css.types__text}>{i.name}</Text>
          </View>
        ))}
      </View>

      <View className={css.blocks} onClick={onSelect}>
        <View className={css.blocks__texts}>
          {times.map((v, k) => (
            <View className={css.blocks__text} key={k}>
              <Text>{v[0]}</Text>
              <Text>{v[1]}</Text>
            </View>
          ))}
        </View>

        {blocks.map((v, k) => (
          <View className={css.blocks__item} data-id={k} key={k}>
            <View
              className={[css.blocks__content, css[`block--${v.type}`]].join(
                ' ',
              )}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default memo(Comp);
