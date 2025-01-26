import {
  AsyncCallback,
  MPSDK,
  MPSocket,
  SocketOnCloseHandler,
  SocketOnErrorHandler,
  SocketOnMessageHandler,
  SocketOnOpenHandler,
} from './types';
import fetch from '@system.fetch';
import router from '@system.router';
import storage from '@system.storage';
import websocketfactory from '@system.websocketfactory';

const promisic = function (func: any) {
  // 返回一个包装后的函数，，可以传参，，，并且返回值是promise
  return function (params = {}) {
    return new Promise((resolve, reject) => {
      const args = Object.assign(params, {
        // 追加他的callback
        success: (res: any) => {
          resolve(res);
        },
        fail: (error: any) => {
          reject(error);
        },
      });

      func(args);
    });
  };
};
export const wrapper = function (qk: MPSDK) {
  //@ts-ignore
  qk.request = fetch.fetch;
  //@ts-ignore
  qk.promisify = promisic;
  qk.canIUse = (api) => {
    if (['onError', 'onUnhandledRejection', 'onAppShow'].includes(api)) {
      return false;
    }
    return true;
  };
  qk.getAccountInfoSync = () => {
    return {
      miniProgram: { appId: '秋日', envVersion: 'develop', version: '1.0.0' },
    };
  };
  qk.getSystemInfoSync = () => {
    return {
      app: 'app',
      brand: 'brand',
      screenWidth: 0,
      screenHeight: 0,
      statusBarHeight: 0,
      version: 'version',
      system: 'system',
      platform: 'android',
      SDKVersion: 'SDKVersion',
      others: [''],
    };
  };
  qk.getSetting = (
    options: AsyncCallback<{ authSetting: Record<string, boolean> }>,
  ) => {
    return {};
  };
  // @ts-ignore
  global.getCurrentPages = function () {
    var pages = router.getPages;
    var ps = [];
    for (var i = 0; i < pages.length; i++) {
      // @ts-ignore
      var p = pages[i];
      ps.push({ route: p.path, options: [] });
    }
    return ps;
  };
  // qk.getStorage = (k)=> {
  //   return storage.get({ key: k });
  // };
  qk.getStorageSync = async (k) => {
    var value = await storage.get({
      key: k,
    });
    return value;
    // return new Promise((resolve, reject) => {
    //   storage.get({
    //     key:  k,
    //     success: function(data) {
    //       resolve(data)
    //     },
    //     fail: function(data, code) {
    //       console.log(`handling fail, code = ${code}`)
    //       reject()
    //     }
    //   })
    // })
  };
  qk.setStorageSync = async (k, v) => {
    // @ts-ignore
    await storage.set({
      key: k,
      value: v,
    });
  };

  qk.getStorageInfoSync = () => {
    return {
      keys: [
        'not-pop-user-agreement',
        'already-privacy',
        'user-detail',
        'is-first-enter',
        'teenage-control',
        'is-first-person',
        'user',
        'page-spy-room',
        'token',
      ],
      currentSize: 0,
      limitSize: 0,
    };
  };

  qk.connectSocket = (param) => {
    console.log('websocket create url:', param.url);
    var websocket = websocketfactory.create({ url: param.url });
    var mpScoket: MPSocket = {
      onClose(handler: SocketOnCloseHandler) {
        websocket.onclose = function (data) {
          console.log(`socket connect close`, data);
          handler(data);
        };
      },
      onError: (handler: SocketOnErrorHandler) => {
        websocket.onerror = function (data) {
          console.log(`socket connect error`, data);
          handler(data.data);
        };
      },
      onOpen: (handler: SocketOnOpenHandler) => {
        // websocket.onopen(handler)
        websocket.onopen = function () {
          console.log(`socket connect open`);
          handler({});
        };
      },
      onMessage: (handler: SocketOnMessageHandler) => {
        websocket.onmessage = function (data) {
          //@ts-ignore
          handler(data);
        };
      },
      send(data: object) {
        //@ts-ignore
        websocket.send(data);
      },
      close(data: {}) {
        console.log('websocket.close', data);
        websocket.close({ code: 1000, reason: 'unhappy', success: () => {} });
      },
    };
    return mpScoket;
  };
};
