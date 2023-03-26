/* 获取手机验证码


import {
  GetPVCInput,
  GetPVCButton,
  getPVCRequest,
  isPhone,
} from '../../components/GetPVC';


getPVCRequest: getPVCRequest = (phone) => {
  return api({
      phone,
    })
    .catch((err) => {
      Taro.showToast({
        title: err.msg || '发送失败',
        icon: 'none',
      });
      throw err;
    });
};


if (!isPhone(phone)) {
  Taro.showToast({
    title: '请输入正确的手机号码',
    icon: 'none',
  });
}


<GetPVCInput />
value={}


<GetPVCButton request={this.getPVCRequest} />
<GetPVCButton request={this.getPVCRequest}>获取验证码</GetPVCButton>
countdown={}

*/

import React, {
  memo,
  useState,
  useEffect,
  CSSProperties,
  useCallback,
  useRef,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, Input, Button } from '@tarojs/components';
import { InputProps } from '@tarojs/components/types/Input';

let css: {
  [key: string]: CSSProperties;
} = {
  input: {
    flex: 1,
    height: '100%',
  },

  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    height: '100%',
    border: 0,
    textAlign: 'center',
    color: 'currentcolor',
  },
};

let phone = '';

export type getPVCRequest = (phone: number) => Promise<any>;
export const isPhone = (arg?: string) => {
  let reg = /^\d{11}$/;
  return reg.test(arg ?? phone);
};

export const GetPVCInput: FC<InputProps> = (props) => {
  useEffect(() => {
    phone = props.value ?? '';
  }, [props.value]);

  let onInput = useCallback(
    (e) => {
      let value = props.onInput?.(e);
      phone = value ?? e.detail.value;
    },
    [props],
  );

  return (
    <Input
      style={css.input}
      name='phone'
      type='number'
      maxlength={11}
      {...props}
      onInput={onInput}
    />
  );
};

export const GetPVCButton: FC<{
  request: getPVCRequest;
  countdown?: string | number;
  children?: string | React.ReactElement;
}> = (props) => {
  let { request, countdown = 60, children = '发送验证码' } = props;

  let [loading, setLoading] = useState(false);
  let [time, setTime] = useState(+countdown);
  let timer = useRef<number>();

  /**重置定时器 */
  let clear = useCallback(() => {
    clearInterval(timer.current);
    setLoading(false);
    setTime(+countdown);
  }, [countdown]);

  /**开始定时器 */
  let start = useCallback(() => {
    setLoading(true);

    let num = +countdown;
    timer.current = setInterval(() => {
      if (--num) {
        setTime(num);
      } else {
        clear();
      }
    }, 1000);
  }, [countdown, clear]);

  useEffect(() => {
    return clear;
  }, [clear]);

  let onClick = useCallback(() => {
    if (loading) return;

    console.log('手机号码', phone);
    if (isPhone()) {
      start();

      /* 请求接口 */
      request(+phone).catch((err) => {
        clear();
        throw err;
      });
    } else {
      Taro.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      });
    }
  }, [request, loading, start, clear]);

  return loading ? (
    <Button style={css.btn} plain loading>
      {time}
    </Button>
  ) : (
    <Button style={css.btn} plain onClick={onClick}>
      {children}
    </Button>
  );
};

// export default memo(Comp);
