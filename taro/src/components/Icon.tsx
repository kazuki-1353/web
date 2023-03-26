import React, {
  CSSProperties,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View } from '@tarojs/components';
import { Property } from 'csstype';

export const rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

let iconParent: CSSProperties = {
  position: 'relative',
  boxSizing: 'content-box',
  overflow: 'hidden',
  display: 'inline-block',
  width: '1em',
  height: '1em',
  borderWidth: '0',
  borderStyle: 'solid',
  borderColor: 'currentcolor',
  verticalAlign: 'middle',
};
let iconChild: CSSProperties = {
  position: 'absolute',
  boxSizing: 'content-box',
  display: 'block',
  width: 0,
  height: 0,
  borderWidth: '0',
  borderStyle: 'solid',
  borderColor: 'currentcolor',
};

let temp = (type): Record<string, CSSProperties> => {
  let baseParent = {
    ...iconParent,
  };
  let baseChild1 = {
    ...iconChild,
  };
  let baseChild2 = {
    ...iconChild,
  };

  switch (type) {
    case '': {
    }

    default: {
      let child = {};

      return {
        parent: {
          ...baseParent,
        },
        child1: {
          ...baseChild1,
          ...child,
        },
        child2: {
          ...baseChild2,
          ...child,
        },
      };
    }
  }
};

/**房屋 */
let getHome = (): Record<string, CSSProperties> => {
  return {
    parent: iconParent,
    child1: {
      ...iconChild,
      borderWidth: '0.5em',
      borderColor: 'transparent',
      borderTopWidth: '0',
      borderBottomColor: 'currentColor',
    },
    child2: {
      ...iconChild,
      top: '0.45em',
      left: '0.15em',
      width: '0.3em',
      height: '0.3em',
      borderWidth: '0.2em',
      borderTopWidth: '0.25em',
      borderBottom: '0',
    },
  };
};

/**加号 */
let getPlus = (type): Record<string, CSSProperties> => {
  switch (type) {
    case 'solid': {
      let child = {
        ...iconChild,
        borderRadius: '0.25em',
        background: '#fff',
      };

      return {
        parent: {
          ...iconParent,
          borderRadius: '1.25em',
          background: 'currentColor',
        },
        child1: {
          ...child,
          top: '0.425em',
          left: '0.15em',
          width: '0.7em',
          height: '0.15em',
        },
        child2: {
          ...child,
          top: '0.15em',
          left: '0.425em',
          width: '0.15em',
          height: '0.7em',
        },
      };
    }

    case 'hollow': {
      let child = {
        ...iconChild,
        borderRadius: '0.25em',
        background: 'currentColor',
      };

      return {
        parent: {
          ...iconParent,
          width: '0.8em',
          height: '0.8em',
          borderWidth: '0.1em',
          borderRadius: '1.25em',
        },
        child1: {
          ...child,
          top: '0.35em',
          left: '0.1em',
          width: '0.6em',
          height: '0.1em',
        },
        child2: {
          ...child,
          top: '0.1em',
          left: '0.35em',
          width: '0.1em',
          height: '0.6em',
        },
      };
    }

    default: {
      let child = {
        ...iconChild,
        borderRadius: '0.25em',
        background: 'currentColor',
      };

      return {
        parent: iconParent,
        child1: {
          ...child,
          top: '0.4em',
          width: '1em',
          height: '0.2em',
        },
        child2: {
          ...child,
          top: '0',
          left: '0.4em',
          width: '0.2em',
          height: '1em',
        },
      };
    }
  }
};

/**减号 */
let getMinus = (type): Record<string, CSSProperties> => {
  switch (type) {
    case 'solid': {
      return {
        parent: {
          ...iconParent,
          borderRadius: '1.25em',
          background: 'currentColor',
        },
        child1: {
          ...iconChild,
          top: '0.425em',
          left: '0.15em',
          width: '0.7em',
          height: '0.15em',
          borderRadius: '0.25em',
          background: '#fff',
        },
      };
    }

    case 'hollow': {
      return {
        parent: {
          ...iconParent,
          width: '0.8em',
          height: '0.8em',
          borderWidth: '0.1em',
          borderRadius: '1.25em',
        },
        child1: {
          ...iconChild,
          top: '0.325em',
          left: '0.1em',
          height: '0.15em',
          width: '0.6em',
          borderRadius: '0.25em',
          background: 'currentColor',
        },
      };
    }

    default: {
      return {
        parent: iconParent,
        child1: {
          ...iconChild,
          top: '0.4em',
          width: '1em',
          height: '0.2em',
          borderRadius: '0.25em',
          background: 'currentColor',
        },
      };
    }
  }
};

/**叉号 */
let getCross = (type): Record<string, CSSProperties> => {
  let baseParent = iconParent;
  let baseChild1 = {
    ...iconChild,
    borderRadius: '0.25em',
    transform: 'rotate(-45deg)',
  };
  let baseChild2 = {
    ...iconChild,
    borderRadius: '0.25em',
    transform: 'rotate(45deg)',
  };

  switch (type) {
    case 'solid': {
      let child = {
        top: '0.425em',
        left: '0.15em',
        width: '0.7em',
        height: '0.15em',
        background: '#fff',
      };

      return {
        parent: {
          ...baseParent,
          borderRadius: '1.25em',
          background: 'currentColor',
        },
        child1: {
          ...baseChild1,
          ...child,
        },
        child2: {
          ...baseChild2,
          ...child,
        },
      };
    }

    case 'hollow': {
      let child = {
        top: '0.3125em',
        left: '0.1em',
        width: '0.6em',
        height: '0.15em',
        background: 'currentColor',
      };

      return {
        parent: {
          ...baseParent,
          width: '0.8em',
          height: '0.8em',
          borderWidth: '0.1em',
          borderRadius: '1.25em',
        },
        child1: {
          ...baseChild1,
          ...child,
        },
        child2: {
          ...baseChild2,
          ...child,
        },
      };
    }

    default: {
      let child = {
        top: '0.4em',
        width: '1em',
        height: '0.2em',
        background: 'currentColor',
      };

      return {
        parent: {
          ...baseParent,
        },
        child1: {
          ...baseChild1,
          ...child,
        },
        child2: {
          ...baseChild2,
          ...child,
        },
      };
    }
  }
};

/**箭头 */
let getChevron = (type): Record<string, CSSProperties> => {
  let baseChild = {
    ...iconChild,
    width: '0.5em',
    height: '0.5em',
    transform: 'rotate(-45deg)',
  };

  switch (type) {
    case 'top': {
      return {
        parent: {
          ...iconParent,
          height: '0.625em',
        },
        child1: {
          ...baseChild,
          top: '0.175em',
          left: '0.175em',
          borderTopWidth: '0.125em',
          borderRightWidth: '0.125em',
        },
      };
    }

    case 'bottom': {
      return {
        parent: {
          ...iconParent,
          height: '0.625em',
        },
        child1: {
          ...baseChild,
          bottom: '0.175em',
          left: '0.175em',
          borderBottomWidth: '0.125em',
          borderLeftWidth: '0.125em',
        },
      };
    }

    case 'left': {
      return {
        parent: {
          ...iconParent,
          width: '0.625em',
        },
        child1: {
          ...baseChild,
          top: '0.175em',
          left: '0.175em',
          borderTopWidth: '0.125em',
          borderLeftWidth: '0.125em',
        },
      };
    }

    case 'right': {
      return {
        parent: {
          ...iconParent,
          width: '0.625em',
        },
        child1: {
          ...baseChild,
          top: '0.175em',
          right: '0.175em',
          borderBottomWidth: '0.125em',
          borderRightWidth: '0.125em',
        },
      };
    }

    default: {
      return {};
    }
  }
};

/**三角 */
let getCaret = (type): Record<string, CSSProperties> => {
  let baseChild = {
    ...iconChild,
    borderWidth: '0.5em',
    borderColor: 'transparent',
  };

  switch (type) {
    case 'top': {
      return {
        parent: {
          ...iconParent,
          height: '0.5em',
        },
        child1: {
          ...baseChild,
          borderTopWidth: '0',
          borderBottomColor: 'currentColor',
        },
      };
    }

    case 'bottom': {
      return {
        parent: {
          ...iconParent,
          height: '0.5em',
        },
        child1: {
          ...baseChild,
          borderBottomWidth: '0',
          borderTopColor: 'currentColor',
        },
      };
    }

    case 'left': {
      return {
        parent: {
          ...iconParent,
          width: '0.5em',
        },
        child1: {
          ...baseChild,
          borderLeftWidth: '0',
          borderRightColor: 'currentColor',
        },
      };
    }

    case 'right': {
      return {
        parent: {
          ...iconParent,
          width: '0.5em',
        },
        child1: {
          ...baseChild,
          borderRightWidth: '0',
          borderLeftColor: 'currentColor',
        },
      };
    }

    default: {
      return {};
    }
  }
};

let getIcon = (icon, type) => {
  let icons = {
    home: getHome,
    plus: getPlus,
    minus: getMinus,
    cross: getCross,
    chevron: getChevron,
    caret: getCaret,
  };

  return icons[icon](type);
};

type Icons =
  | {
      icon: 'home';
      type?: '';
    }
  | {
      icon: 'plus';
      type?: '' | 'solid' | 'hollow';
    }
  | {
      icon: 'minus';
      type?: '' | 'solid' | 'hollow';
    }
  | {
      icon: 'cross';
      type?: '' | 'solid' | 'hollow';
    }
  | {
      icon: 'chevron';
      type: 'top' | 'bottom' | 'left' | 'right';
    }
  | {
      icon: 'caret';
      type: 'top' | 'bottom' | 'left' | 'right';
    };

const Comp: FC<Icons & {
  size?: string | number;
  color?: Property.Color;
}> = memo((props) => {
  let { icon, type, size, color } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    let { parent, child1, child2 } = getIcon(icon, type);

    return {
      parent: {
        ...parent,
        fontSize: size ? rpx2rem(size) : 'unset',
        color,
      },
      child1,
      child2,
    };
  }, [icon, type, size, color]);

  return (
    <View style={css.parent}>
      <View style={css.child1} />
      <View style={css.child2} />
    </View>
  );
});

export default Comp;
