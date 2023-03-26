import { FC, memo, useState, useEffect, useCallback } from 'react';
import { IRouteComponentProps, Helmet } from 'umi';

import css from './index.scss';

function Layout(props: IRouteComponentProps) {
  return (
    <div className={css.wrap}>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title></title>
      </Helmet> */}

      {props.children}
    </div>
  );
}

export default memo(Layout);
