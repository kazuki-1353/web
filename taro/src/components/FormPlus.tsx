/*

import FormPlus, { InputPlus, ButtonPlus } from '../../components/FormPlus';

<FormPlus onSubmit={this.onSubmit}></FormPlus>



<InputPlus name='' />

value={}
onInput={this.onInput}
onBlur={this.onBlur}
onConfirm={this.onConfirm}

// 清空按钮
clear

// 聚焦
focus={focus}

// 自定义组件包裹器, 值无法传到 Form
custom



<ButtonPlus>搜索</ButtonPlus>

*/

import React, {
  CSSProperties,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import {
  Block,
  View,
  CustomWrapper,
  Form,
  Button,
  Input,
  Textarea,
  Icon,
} from '@tarojs/components';

let css: {
  [key: string]: CSSProperties;
} = {
  inputPlus: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  inputPlus__input: {
    flex: 'auto',
    height: '100%',
  },
  inputPlus__clear: {
    flex: 'none',
  },

  textareaPlus: {
    width: '100%',
    height: '100%',
  },

  buttonPlus: {
    all: 'unset',
    position: 'relative',
  },
  buttonPlus__text: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export const InputPlus: FC<typeof Input.defaultProps & {
  custom?: boolean; //使用 CustomWrapper 后值无法传到 Form
  clear?: boolean;
  onInput?: (value: Record<string, string>) => void;
  onConfirm?: (value: Record<string, string>) => void;
}> = memo((props) => {
  let {
    name = 'value',
    value: valueP = '',
    type,
    custom = false,
    clear = false,
  } = props;

  let [valueS, setValueS] = useState(`${valueP}`);
  let [focus, setFocus] = useState(props.focus);
  let [showClear, setShowClear] = useState(clear);
  let ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValueS(`${valueP}`);
  }, [valueP]);

  let onFocus = useCallback(
    (e) => {
      setFocus(true);
      setShowClear(false);
      props.onFocus?.(e);
    },
    [props],
  );

  let onBlur = useCallback(
    (e) => {
      setFocus(false);
      setShowClear(clear);
      props.onBlur?.(e);
    },
    [props, clear],
  );

  let onInput = useCallback(
    (e) => {
      let { value } = e.detail;
      props.onInput?.({
        [name]: value.trim(),
      });

      setValueS(value);
    },
    [props, name],
  );

  let onConfirm = useCallback(
    (e) => {
      let { value } = e.detail;
      props.onConfirm?.({
        [name]: value.trim(),
      });

      onBlur(e);
    },
    [props, name, onBlur],
  );

  let onClear = useCallback(() => {
    /* 等待更新 value 后再清空 */
    setTimeout(() => {
      setValueS('');
      setFocus(true);
    });
  }, []);

  let Comp = (
    <View style={css.inputPlus}>
      <Input
        {...props}
        style={css.inputPlus__input}
        ref={ref}
        name={name}
        type={type}
        value={valueS}
        focus={focus}
        adjustPosition={false}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onConfirm={onConfirm}
      />

      {showClear && (
        <Icon style={css.inputPlus__clear} type='clear' onClick={onClear} />
      )}
    </View>
  );

  return custom ? <CustomWrapper>{Comp}</CustomWrapper> : <Block>{Comp}</Block>;
});

export const TextareaPlus: FC<typeof Textarea.defaultProps> = memo((props) => {
  return (
    <Textarea {...props} style={css.textareaPlus} maxlength={-1} autoHeight />
  );
});

export const ButtonPlus: FC<typeof Button.defaultProps> = memo((props) => {
  let { children = '确认' } = props;
  return (
    <Button {...props} style={css.buttonPlus} plain formType='submit'>
      <View style={css.buttonPlus__text}>{children}</View>
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

const FormPlus: FC<typeof Form.defaultProps> = (props) => {
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
    <Form {...props} style={css.formPlus} onSubmit={onSubmit}>
      {children}
    </Form>
  );
};

export default memo(FormPlus);
