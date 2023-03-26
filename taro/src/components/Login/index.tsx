/*

import Login from '../../components/Login.v4';

// 类组件
refLogin = React.createRef<Login>();
<Login ref={this.refLogin} />
let current = this.refLogin.current;

// 函数组件
let refLogin = React.useRef<Login>(null);
<Login ref={refLogin} />

let current = refLogin.current;

let userInfo = current?.login();// 授权登录后获取用户信息
let userInfo = current?.getStorage();// 直接获取用户信息
let userInfo = current?.authorize();// 弹出授权弹窗
userInfo?.then((res) => {});

*/

import React, { PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

import api from '../api.h5';
import store from '../store';
import actions from '../actions/api';

import css from './Login.module.scss';

type Opt = Parameters<typeof api.h5PddUserInfo>[0];
type Resolve = Partial<
  Taro.getUserInfo.SuccessCallbackResult & {
    avatar_url: string;
    nickname: string;
    sex: number;
  }
>;

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {
  isShow: boolean;
  canIUse: boolean;
};

class Comp extends PureComponent<
  OwnProps & StateProps & DispatchProps,
  OwnState
> {
  state = {
    canIUse: true,
    isShow: false,
  };

  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      this.setState({
        canIUse: true,
      });
    } else {
      const canIUse = Taro.canIUse('getUserProfile');
      this.setState({
        canIUse,
      });
    }
  }

  login = (opt?: Opt) => {
    Taro.showLoading({
      title: '加载中...',
      mask: true,
    });

    return new Promise<Resolve>((resolve) => {
      this.getStorage(opt)
        .then((res) => {
          Taro.hideLoading();
          resolve(res);
        })
        .catch(() => {
          Taro.hideLoading();
          this.authorize().then(resolve);
        });
    });
  };

  authorize = () => {
    return new Promise<Resolve>((resolve) => {
      this.success = resolve;
      this.setState({
        isShow: true,
      });
    });
  };

  /**获取贮存 */
  getStorage = (opt?: Opt) => {
    return new Promise<Resolve>((resolve, reject) => {
      let state = store.getState();
      let userInfo = state.api?.userInfoPDD;
      if (userInfo?.is_authorize) {
        console.log('从贮存获取用户信息', userInfo);
        store.dispatch(actions.userInfoPDD(userInfo));
        resolve(userInfo);
      } else {
        this.getUserInfoAPI(opt).then(resolve).catch(reject);
      }
    });
  };

  /**从接口获取用户信息 */
  getUserInfoAPI = (opt?: Opt) => {
    return api.h5PddUserInfo(opt).then((res) => {
      let { data } = res;
      if (!data.is_authorize && process.env.TARO_ENV === 'weapp') {
        throw new Error('未授权');
      }

      let userInfo = {
        ...data,
        nickName: data.nickname,
        avatarUrl: data.avatar_url,
        gender: data.sex,
      };

      console.log('从接口获取用户信息', userInfo);
      return userInfo;
    });
  };

  /* 获取用户信息 */
  getUserInfo = () => {
    return new Promise<Resolve>((resolve, reject) => {
      Taro.getUserProfile({
        desc: '获取用户信息',
        lang: 'zh_CN',
        success: resolve,
        fail: reject,
      });
    });
  };

  /**回调函数 */
  success: (data) => void;
  onConfirm = () => {
    this.getUserInfo()
      /* 若处于getUserProfile之前会报错 */
      .then((res) => {
        Taro.showLoading({
          title: '加载中...',
          mask: true,
        });

        return res;
      })
      .then(this.adapter)
      .then(this.submit)
      .then(this.success)
      .then(() => {
        console.log('确认授权后获取用户信息');

        this.setState(
          {
            isShow: false,
          },
          Taro.hideLoading,
        );
      })
      .catch(Taro.hideLoading);
  };

  /**转换数据格式 */
  adapter = (data: Taro.getUserInfo.SuccessCallbackResult) => {
    return new Promise((resolve, reject) => {
      let { userInfo, encryptedData, iv } = data;
      if (userInfo) {
        resolve({
          ...userInfo,

          avatar_url: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          sex: userInfo.gender,

          encryptedData,
          iv,
        });
      } else {
        reject(data.errMsg);
      }
    });
  };

  /**用接口提交用户信息 */
  submit = (data) => {
    return new Promise<typeof data>((resolve, reject) => {
      Taro.login({
        success({ code }) {
          console.log('提交用户信息');

          api
            .h5PddUserSave({
              ...data,
              code,
            })
            .then((res) => {
              resolve(res.data || data);
            })
            .catch(reject);
        },
        fail: reject,
      });
    });
  };

  onClose = () => {
    this.setState({
      isShow: false,
    });
  };

  render() {
    let { canIUse, isShow } = this.state;
    return isShow ? (
      <View>
        <View className={css.isMask} />

        <View className={css.isLogin}>
          <View className={css.loginTitle}>微信授权</View>

          <View className={css.loginshopImg}>
            <View>小程序将获取以下权限：</View>
            <View className={css.subTitle}>
              (如未授权，可能无法正常使用部分功能)
            </View>
          </View>

          <View className={css.isAgary}>
            <Text className='margin-right-sm'>•</Text>
            <View>获取你的公开信息(昵称、头像等)</View>
          </View>

          {canIUse ? (
            <View className={css.isLoginBtn}>
              <Button
                className={['reset', css.userInfoBtn].join(' ')}
                lang='zh_CN'
                onClick={this.onConfirm}
              >
                授权
              </Button>

              <View
                className={[css.userInfoBtn, css.cencelBtn].join(' ')}
                onClick={this.onClose}
              >
                先不授权
              </View>
            </View>
          ) : (
            <View className={css.levelLow}>请升级微信版本</View>
          )}
        </View>
      </View>
    ) : null;
  }
}

export default Comp;
