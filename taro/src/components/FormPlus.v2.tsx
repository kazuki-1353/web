/*

import FormPlus, { ButtonPlus } from '../../components/FormPlus';

<FormPlus onSubmit={this.onSubmit}></FormPlus>
<ButtonPlus>搜索</ButtonPlus>

*/

import React, {
  FC,
  CSSProperties,
  memo,
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import Taro from '@tarojs/taro';
import {
  Block,
  View,
  CustomWrapper,
  Form,
  FormProps,
  Button,
  ButtonProps,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
  Checkbox,
  CheckboxProps,
  Label,
  Icon,
} from '@tarojs/components';

/**返回数值与小数点 */
export const getNumStr = (str: string) => {
  let reg = /(\d+\.?\d*)/;
  let match = str.match(reg);
  return match ? match[0] : null;
};

/*
import { InputPlus } from '../../components/FormPlus';

<InputPlus name='' />

value={}
onInput={this.onInput}
onConfirm={this.onConfirm}

onBlur={this.onBlur}
onBlur = (e) => {
  let num = Number(e.detail.value);

  this.setState(() => {
    return { value: num.toFixed(2) };
  });
};

// 清空按钮
clear

// 聚焦
focus={focus}

// 使用 CustomWrapper
custom

*/
export const InputPlus: FC<InputProps & {
  custom?: boolean; //使用 CustomWrapper 后值无法传到 Form.onSubmit
  clear?: boolean;
  onInput?: (value: Record<string, string>) => void;
  onConfirm?: (value: Record<string, string>) => void;
}> = memo((props) => {
  let {
    name = 'value',
    type,
    value: valueP = '',
    custom = false,
    clear = false,
    onFocus: onPropFocus,
    onBlur: onPropBlur,
    onInput: onPropInput,
    onConfirm: onPropConfirm,
  } = props;

  let [valueS, setValueS] = useState(`${valueP}`);
  let [focus, setFocus] = useState(props.focus || false);
  let [isShowClear, setShowClear] = useState(clear);
  let ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValueS(`${valueP}`);
  }, [valueP]);

  let onFocus = useCallback(
    (e) => {
      setFocus(true);
      setShowClear(false);
      onPropFocus?.(e);
    },
    [onPropFocus],
  );

  let onBlur = useCallback(
    (e) => {
      setFocus(false);
      setShowClear(clear);
      onPropBlur?.(e);
    },
    [onPropBlur, clear],
  );

  let [, forceUpdate] = useReducer((n) => n + 1, 0);
  let onInput = useCallback(
    (e) => {
      let value = e.detail.value.trim();

      /* 非空时 */
      if (value) {
        if (type === 'number' || type === 'digit') {
          forceUpdate(); //强制刷新, 避免相同数据无法更新

          value = getNumStr(value);
          if (!value) return;
        }
      }

      onPropInput?.({
        [name]: value,
      });

      setValueS(value);
    },
    [onPropInput, name, type],
  );

  let onConfirm = useCallback(
    (e) => {
      let value = e.detail.value.trim();

      onPropConfirm?.({
        [name]: value,
      });

      onBlur(e);
    },
    [onPropConfirm, name, onBlur],
  );

  let onClear = useCallback(() => {
    /* 等待更新 value 后再清空 */
    setTimeout(() => {
      setValueS('');
      setFocus(true);
    });
  }, []);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
      input: {
        display: process.env.TARO_ENV === 'weapp' ? 'block' : 'flex', // 避免小程序宽度异常
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        height: '100%', // 避免H5高度异常
        borderWidth: 0,
        textAlign: process.env.TARO_ENV === 'rn' ? 'auto' : 'unset',
        backgroundColor: 'transparent',
      },
      clear: {
        flexShrink: 0,
      },
    };
  }, []);

  let Comp = (
    <View style={css.wrap}>
      <Input
        {...props}
        style={css.input}
        ref={ref}
        name={name}
        value={valueS}
        focus={focus}
        adjustPosition={false}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onConfirm={onConfirm}
      />

      {isShowClear && <Icon style={css.clear} type='clear' onClick={onClear} />}
    </View>
  );

  return custom ? <CustomWrapper>{Comp}</CustomWrapper> : <Block>{Comp}</Block>;
});

export const TextareaPlus: FC<TextareaProps> = memo((props) => {
  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  return <Textarea {...props} style={css.wrap} maxlength={-1} autoHeight />;
});

/*

import { CheckboxPlus, CheckboxItem } from '../../components/FormPlus';

<CheckboxPlus></CheckboxPlus>

type='circle'
color=''

onChange={this.onChange}
onChange = (e: CheckboxItem) => {
  let { name, value, checked } = e;
}

*/
export type CheckboxItem = {
  name: string;
  value: any;
  checked: boolean;
};
export const CheckboxPlus: FC<Omit<CheckboxProps, 'value' | 'onChange'> & {
  type?: 'square' | 'circle';
  name?: string;
  value?: any;

  /**是否全宽 */ fill?: boolean;
  /**是否阻止冒泡 */ stopPropagation?: boolean;
  /**切换事件 */ onChange?: (e: CheckboxItem) => void;
}> = memo((props) => {
  let {
    children,
    type = 'square',
    name = '',
    value = '',
    checked = false,
    fill = false,
    color,
    stopPropagation = false,
    onChange,
  } = props;

  let [isCheck, setCheck] = useState(checked);
  useEffect(() => {
    setCheck(checked);
  }, [checked]);

  let onClick = useCallback(() => {
    setCheck((state) => {
      onChange?.({
        name,
        value,
        checked: !state,
      });
      return !state;
    });
  }, [name, value, onChange]);

  let onClickContent = useCallback(
    (e) => {
      if (stopPropagation) e.stopPropagation();
    },
    [stopPropagation],
  );

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        display: fill ? 'flex' : 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: fill ? '100%' : 'auto',
      },
      icon: {
        flexShrink: 0,
        verticalAlign: 'middle',
      },
      content: {
        flexGrow: 1,
        overflow: 'hidden',
      },
    };
  }, [fill]);

  return (
    <View style={css.wrap} onClick={onClick}>
      {type === 'circle' ? (
        <Block>
          {isCheck ? (
            <Icon style={css.icon} type='success' color={color} />
          ) : (
            <Icon style={css.icon} type='circle' />
          )}
        </Block>
      ) : (
        <Checkbox
          style={css.icon}
          value={value}
          checked={isCheck}
          color={color}
        />
      )}

      <View style={css.content} onClick={onClickContent}>
        {children}
      </View>
    </View>
  );
});

export const ButtonPlus: FC<ButtonProps> = memo((props) => {
  let { children = '确认' } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        all: 'unset',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        height: '100%',
        borderWidth: 0,
        outline: 'none',
        fontSize: process.env.TARO_ENV === 'rn' ? 'auto' : 'inherit', // 避免H5字体异常
        color: 'inherit',
        backgroundColor: 'transparent',
      },
    };
  }, []);

  return (
    <Button {...props} style={css.wrap} plain formType='submit'>
      {children}
    </Button>
  );
});

let getValues = (e) => {
  let { detail, target } = e;
  if (detail) {
    return detail.value;
  } else {
    let keys = Object.keys(target);
    let values = keys.reduce((p, key) => {
      let item = e.target[key];
      let { name, value } = item;
      if (name) {
        return {
          ...p,
          [name]: value,
        };
      } else {
        return p;
      }
    }, {});

    return values;
  }
};

const FormPlus: FC<FormProps> = (props) => {
  let { children } = props;

  let onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      let values = getValues(e);
      console.log('提交表单', values);
      props.onSubmit?.(values);
    },
    [props],
  );

  return (
    <Form {...props} onSubmit={onSubmit}>
      {children}
    </Form>
  );
};

export default memo(FormPlus);
