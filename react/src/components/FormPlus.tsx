/*

import FormPlus, { ButtonPlus } from '@/components/FormPlus';

<FormPlus onSubmit={this.onSubmit}></FormPlus>
<ButtonPlus>搜索</ButtonPlus>

*/

import React, {
  CSSProperties,
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

export const CrossHollow: FC = memo(() => {
  let css = useMemo<{
    [key: string]: CSSProperties;
  }>(() => {
    let child: CSSProperties = {
      position: 'absolute',
      top: '0.3125em',
      left: '0.1em',

      display: 'block',
      width: '0.6em',
      height: '0.15em',
      borderRadius: '0.25em',
      background: 'currentColor',
    };

    return {
      cross: {
        position: 'relative',
        boxSizing: 'content-box',
        overflow: 'hidden',
        display: 'inline-block',

        width: '0.8em',
        height: '0.8em',
        border: '0.1em solid currentColor',
        borderRadius: '1.25em',
        verticalAlign: 'middle',
      },
      child1: {
        ...child,
        transform: 'rotate(-45deg)',
      },
      child2: {
        ...child,
        transform: 'rotate(45deg)',
      },
    };
  }, []);

  return (
    <div style={css.cross}>
      <div style={css.child1} />
      <div style={css.child2} />
    </div>
  );
});

/* 

import { InputPlus } from '@/components/FormPlus';

<InputPlus name='' />

value={}
onInput={this.onInput}
onBlur={this.onBlur}

// 清空按钮
clear

// 聚焦
focus={focus}

 */
export const InputPlus: FC<
  React.InputHTMLAttributes<any> & {
    focus?: boolean;
    clear?: boolean;
    onInput?: (value: Record<string, string>) => void;
  }
> = memo((props) => {
  let {
    name = 'value',
    value: valueP = '',
    type,
    placeholder,
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
    (e: React.FocusEvent) => {
      setFocus(true);
      setShowClear(false);
      props.onFocus?.(e);
    },
    [props],
  );

  let onBlur = useCallback(
    (e: React.FocusEvent) => {
      setFocus(false);
      setShowClear(clear);
      props.onBlur?.(e);
    },
    [props, clear],
  );

  let onInput = useCallback(
    (e: React.FormEvent) => {
      let { value } = e.target;
      props.onInput?.({
        [name]: value.trim(),
      });

      setValueS(value);
    },
    [props, name],
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
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
      input: {
        // all: 'unset',
        flex: 'auto',
        width: '100%',
        height: '100%',
        border: 'none',
        textAlign: 'unset',
        background: 'transparent',
      },
      clear: {
        flex: 'none',
      },
    };
  }, []);

  return (
    <div style={css.wrap}>
      <input
        {...props}
        style={css.input}
        ref={ref}
        name={name}
        type={type}
        value={valueS}
        autoFocus={focus}
        placeholder={placeholder}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {showClear && (
        <div style={css.clear} onClick={onClear}>
          <CrossHollow />
        </div>
      )}
    </div>
  );
});

export const TextareaPlus: FC<React.TextareaHTMLAttributes<any>> = memo(
  (props) => {
    let css = useMemo<Record<string, CSSProperties>>(() => {
      return {
        wrap: {
          width: '100%',
          height: '100%',
        },
      };
    }, []);

    return <textarea {...props} style={css.wrap} maxLength={-1} />;
  },
);

/*

import { CheckboxPlus, CheckboxItem } from '@/components/FormPlus';

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
export const CheckboxPlus: FC<
  Omit<React.InputHTMLAttributes<any>, 'onChange'> & {
    type?: 'square' | 'circle';
    name?: string;
    onChange?: (e: CheckboxItem) => void;
  }
> = memo((props) => {
  let {
    children,
    type = 'square',
    color,
    name = '',
    value = '',
    checked = false,
    onChange,
  } = props;

  let [isCheck, setCheck] = useState(checked);
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

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
      },

      icon: {
        verticalAlign: 'middle',
      },
    };
  }, []);

  return (
    <label style={css.wrap} onClick={onClick}>
      {type === 'circle' ? (
        <>
          {isCheck ? (
            <span style={css.icon} type='success' color={color} />
          ) : (
            <span style={css.icon} type='circle' />
          )}
        </>
      ) : (
        <input type='checkbox' name={name} value={value} color={color} />
      )}

      <span style={css.content}>{children}</span>
    </label>
  );
});

export const ButtonPlus: FC<React.ButtonHTMLAttributes<any>> = memo((props) => {
  let { children = '确认' } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        // all: 'unset',
        position: 'relative',
        border: 'none',
        outline: 'none',
        background: 'transparent',
      },
      children: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
  }, []);

  return (
    <button {...props} style={css.wrap} type='submit'>
      <div style={css.children}>{children}</div>
    </button>
  );
});

let getValues = (e: React.FormEvent) => {
  let { target } = e;
  let keys = Object.keys(target);
  let values = keys.reduce((p, key) => {
    let item = target[key];
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
};

const FormPlus: FC<{
  children: React.ReactChild | React.ReactChild[];
  onSubmit: (e: Record<string, any>) => void;
}> = (props) => {
  let { children } = props;

  let onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      let values = getValues(e);
      console.log('提交表单', values);
      props.onSubmit?.(values);
    },
    [props],
  );

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {},
    };
  }, []);

  return (
    <form {...props} style={css.wrap} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default memo(FormPlus);
