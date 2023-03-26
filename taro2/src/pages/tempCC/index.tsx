import Taro, { Config, ComponentClass, PureComponent } from '@tarojs/taro';
// import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';

// import api from '../../api';

// import css from './index.module.scss';

type PageStateProps = {};
type PageDispatchProps = {};
type PageOwnProps = {};
interface Comp {
  props: PageStateProps & PageDispatchProps & PageOwnProps
}
// @connect(
//   (state) => {
//     return {};
//   },
//   // (dispatch) => ({}),
// )
class Comp extends PureComponent<{}, {}> {
  // constructor(props) {
  //   super(props);
  // }

  state = {};

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}

  // config: Config = {
  //   navigationBarTitleText: '',
  // };
  // static options = {
  //   addGlobalClass: true,
  // };

  render() {
    return <View className=''></View>;
  }
}

export default Comp as ComponentClass<PageOwnProps>;
