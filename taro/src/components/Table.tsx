/*

import Table from '../../../components/Table';

<Table data={tableData} columns={tableColumns} />
<Table data={tableData} columns={tableColumns} rowKey='' />

let columns = useMemo(() => {
  return [
    {
      rowKey: '',
      render(item, index) {
        return <View>{item.value}</View>;
      },
      onClick(item) {},

      title: '',
      titleRender(item, index) {
        return <View>{item.title}</View>;
      },
      onTitleClick(item) {},
    },
  ];
}, []);

*/

import React, {
  FC,
  CSSProperties,
  ReactNode,
  memo,
  useMemo,
  useCallback,
} from 'react';

import Taro from '@tarojs/taro';
import { Block, View, Text } from '@tarojs/components';

export const rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

type Item = Record<string, any>;
type ItemRender = (item: Item, index: number) => ReactNode | ReactNode[];
type ItemClick = (item: Item, index: number) => void;

const Cell: FC<{
  children: ReactNode | ReactNode[];
  data: Item;
  index: number;

  splitLine?: boolean;
  render?: ItemRender;
  onClick?: ItemClick;
}> = memo((props) => {
  let { children, data, index, splitLine = false, render, onClick } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      cell: {
        position: 'relative',
        boxSizing: 'border-box',
        display: 'table-cell',
        padding: rpx2rem(16),
        borderBottom: '1px solid #f0f0f0',
        overflowWrap: 'break-word',
      },
      line: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        margin: 'auto',
        width: 1,
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
      },
    };
  }, []);

  let _onClick = useCallback(() => onClick?.(data, index), []);

  return (
    <View style={css.cell} onClick={onClick && _onClick}>
      {render
        ? render(data, index)
        : [
            <View key='children'>{children}</View>,
            splitLine && Boolean(index) && <Text key='line' style={css.line} />,
          ]}
    </View>
  );
});

const Comp: FC<{
  data: Record<string, any>[];

  columns: {
    /**每列的元素键 */ rowKey: string;
    style?: Record<string, CSSProperties>;
    render?: ItemRender;
    onClick?: ItemClick;

    /**表格列头 */ title?: string;
    titleStyle?: Record<string, CSSProperties>;
    titleRender?: ItemRender;
    onTitleClick?: ItemClick;
  }[];

  /**每行的元素键 */ rowKey?: string;
}> = memo((props) => {
  let { data = [], columns = [], rowKey = 'id' } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      table: {
        display: 'table',
        width: '100%',
        tableLayout: 'auto',
        borderCollapse: 'separate',
        borderSpacing: 0,
      },
      header: {
        display: 'table-row',
        background: '#fafafa',
      },
      row: {
        display: 'table-row',
      },
    };
  }, []);

  if (!data.length) return null;
  if (!columns.length) return null;

  return (
    <View style={css.table}>
      <View style={css.header}>
        {columns.map((col, index) => {
          let item = col.title;
          if (item === undefined) return null;

          return (
            <Cell
              key={col.rowKey}
              data={col}
              index={index}
              render={col.titleRender}
              splitLine
              onClick={col.onTitleClick}
            >
              {item}
            </Cell>
          );
        })}
      </View>

      {data.map((row) => (
        <View style={css.row} key={row[rowKey]}>
          {columns.map((col, index) => {
            let item = row[col.rowKey];

            return (
              <Cell
                key={col.rowKey}
                data={row}
                index={index}
                render={col.render}
                onClick={col.onClick}
              >
                {item}
              </Cell>
            );
          })}
        </View>
      ))}
    </View>
  );
});

export default Comp;
