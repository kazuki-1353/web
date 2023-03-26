/* 

import Socket from './utils/Socket';

let socket = new Socket({
  url: '',
  typeKey: '',
  dataKey: '',
  onClose(res) {}
  onMessage(res) {},
});

socket.send({
  type: '',
);
socket.send({
  type: '',
  data: {},
);
socket.send({
  type: '',
  resType: '',
  data: {},
).then(res=>{})

*/

import Taro, { SocketTask } from '@tarojs/taro';

class MyType {
  url: string;

  onOpen?: SocketTask.OnOpenCallback;
  onClose?: SocketTask.OnCloseCallback;
  onError?: SocketTask.OnErrorCallback;
  onMessage?: (data: { [key: string]: any }) => void;
}
interface Props extends MyType {
  /**返回消息类型键名 */ typeKey?: string
  /**返回消息数据键名 */ dataKey?: string
}
interface Socket {
  /**返回消息类型键名 */ typeKey: string
  /**返回消息数据键名 */ dataKey: string
}
const Socket = class extends MyType {
  SocketTask: Promise<SocketTask>;

  /**是否开启 */ isOpened = false;
  /**失败次数 */ private failTimes = 0;

  constructor(props: Props) {
    super();

    this.url = props.url;
    this.typeKey = props.typeKey || 'type';
    this.dataKey = props.dataKey || 'data';

    this.onOpen = props.onOpen;
    this.onClose = props.onClose;
    this.onMessage = props.onMessage;
    this.onError = props.onError;

    this.connect();
  }

  connect() {
    if (!this.isOpened) {
      this.SocketTask = new Promise<SocketTask>((resolve, reject) => {
        Taro.connectSocket({
          url: this.url,
        }).then((task) => {
          task.onOpen((res) => {
            console.log('Socket 已打开', res);
            this.isOpened = true;
            this.onOpen && this.onOpen(res);
            resolve(task);
          });

          task.onClose((res) => {
            console.log('Socket 已关闭', res);
            this.isOpened = false;
            switch (res.code) {
              case 1000:
                this.onClose && this.onClose(res);
                break;

              default:
                this.reconnect();
            }
          });

          task.onMessage((res) => {
            const data: {} = JSON.parse(res.data);
            this.onMessage && this.onMessage(data);
          });

          task.onError((err) => {
            this.isOpened = false;
            this.onError && this.onError(err);
            reject(err);
          });
        });
      });
    }

    return this.SocketTask;
  }

  reconnect() {
    return new Promise((resolve, reject) => {
      this.failTimes += 1;
      console.log(`Socket 连接失败${this.failTimes}次`);

      if (this.failTimes > 1) {
        Taro.showModal({
          content: '连接已断开',
          confirmText: '是否重新连接？',
          success: ({ confirm }) => {
            if (confirm) {
              this.connect().then(resolve);
            } else {
              reject();
            }
          },
        });
      } else {
        this.connect().then(resolve);
      }
    });
  }

  close(
    opt = {
      code: 1000,
      reason: '关闭',
    },
  ) {
    return new Promise((resolve, reject) => {
      if (this.isOpened) {
        Taro.closeSocket({
          code: opt.code,
          reason: opt.reason,
          success: (res) => {
            this.isOpened = false;
            resolve(res);
          },
          fail: reject,
        });
      } else {
        resolve();
      }
    });
  }

  send<T>(msg: {
    /**发送类型 */ type: string
    /**发送数据 */ data?: {}
    /**接收类型 */ resType?: string
  }) {
    const { type, data, resType } = msg;

    return new Promise<T>((resolve, reject) => {
      this.SocketTask.then((task) => {
        if (this.isOpened) {
          const sendData = JSON.stringify({
            [this.typeKey]: type,
            [this.dataKey]: data,
          });

          task.send({
            data: sendData,
            success() {
              resType || resolve();
            },
            fail: reject,
          });

          if (resType) {
            const { typeKey, dataKey } = this;
            task.onMessage((res) => {
              const resMsg: {} = JSON.parse(res.data);
              if (resMsg[typeKey] === resType) {
                resolve(resMsg[dataKey]);
              }
            });
          }
        } else {
          reject();
        }
      });
    });
  }
};

export default Socket;
