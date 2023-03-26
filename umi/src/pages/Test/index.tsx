import React, { memo, useMemo, useCallback, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import type { Properties } from 'csstype';

import { useRequest, useModel, history, Link } from 'umi';
import { message, Spin, Empty, Space, Typography, Image, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

// import api from '@/services';
// import css from './index.less';

const { Paragraph, Text, Title } = Typography;

const Comp: FC<{
  // children: ReactNode | ReactNode[];
}> = memo((props) => {
  // let { children } = props;
  // let { query = {} } = history.location;

  // let [data, setData] = useState();
  // if (!data) return <Empty />;

  // useEffect(() => {}, []);
  // let fun = useCallback(() => {}, []);
  // let { initialState, setInitialState } = useModel('@@initialState');

  // const css = useMemo<Record<string, Properties>>(() => {
  //   return {
  //     wrap: {},
  //   };
  // }, []);

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <Spin>
        <Empty />
      </Spin>
    </PageContainer>
  );
});

export default Comp;
