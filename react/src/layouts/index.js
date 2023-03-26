import React from 'react';
import styles from './index.css';

const BasicLayout = (props) => {
  return <div className={styles.wrap}>{props.children}</div>;
};

export default BasicLayout;
