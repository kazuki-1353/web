/*

import KeepAlive, { AliveScope } from './utils/KeepAlive';

ReactDOM.render(
  <AliveScope>
    <App />
  </AliveScope>,
  document.getElementById('root'),
);

<KeepAlive id=''>
  <Comp />
</KeepAlive>

*/

import React, { Component, createContext } from 'react';
import type { FC, ComponentClass, ReactChildren } from 'react';

type Context = (id: string, children: HTMLDivElement) => Promise<HTMLDivElement>;
const { Provider, Consumer } = createContext<Context>(() => Promise.reject());

export class AliveScope extends Component {
  //缓存children的真实DOM节点
  nodes: Record<string, HTMLDivElement> = {};

  //缓存keep-alive中的children实例，通过ref获取到真实DOM，存到nodes中
  state: Record<
    string,
    {
      children: ReactChildren;
      id: string;
    }
  > = {};

  keep: Context = (id, children) => {
    return new Promise((resolve) => {
      this.setState(
        {
          [id]: { id, children },
        },
        () => resolve(this.nodes[id]),
      );
    });
  };

  render() {
    const values = Object.values(this.state);

    return (
      <Provider value={this.keep}>
        {this.props.children}

        {/* 为了通过ref获取真实Dom，然后会被插入到KeepAlive组件中去 */}
        {values.map((i) => {
          const { id, children } = i;
          return (
            <div
              key={id}
              ref={(node) => {
                if (node) this.nodes[id] = node;
              }}
            >
              {children}
            </div>
          );
        })}
      </Provider>
    );
  }
}

type KeepAliveProps = {
  children: ReactChildren;
  id: string;
  keep: (id: string, children: ReactChildren) => Promise<HTMLDivElement>;
};
class KeepAlive extends Component<KeepAliveProps> {
  constructor(props: KeepAliveProps) {
    super(props);
    const { children, id, keep } = props;

    // 捕获children属性，缓存，然后通过ref转换为真实dom节点，然后获取
    const prom = keep(id, children);
    prom.then((realContent) => {
      //如果文档树中已经存在了 realContent，它将插入新位置。
      const dom = this.ref.current;
      if (dom) dom.appendChild(realContent);
    });
  }

  ref = React.createRef<HTMLDivElement>();

  render() {
    return <div ref={this.ref} />;
  }
}

//withScope是一个高阶组件，将KeepAlive组件传入，返回一个新的组件
//withScope使用了context api捕获了传入的虚拟DOM节点，桥接了父组件以及KeepAlive组件的关联，
//一旦children属性改变，那么withScope被刷新，进而传入新的children属性给KeepAlive组件，
//导致数据驱动可以进行组件刷新
const withScope = (WrappedComponent: ComponentClass<KeepAliveProps>) => {
  const HOC: FC<{
    id: string;
  }> = (props: any) => (
    <Consumer>
      {(keep) => {
        return <WrappedComponent {...props} keep={keep} />;
      }}
    </Consumer>
  );

  return HOC;
};
export default withScope(KeepAlive);
