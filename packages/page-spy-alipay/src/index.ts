import PageSpy, {
  setMPSDK,
  Client,
  SocketStoreBase,
  platformAPI,
} from '@huolala-tech/page-spy-mp-base';
import { SpyClient } from '@huolala-tech/page-spy-types';

// reassign the global.mp to uni

declare const my: any;

setMPSDK(my);

// alipay toxic storage api...
platformAPI.getStorageSync = (key: string) => {
  const res = my.getStorageSync({ key });
  if (res.success) {
    return res.data;
  }
  return undefined;
};

platformAPI.setStorageSync = (key: string, value: any) => {
  return my.setStorageSync({ key, data: value });
};

platformAPI.removeStorageSync = (key) => {
  return my.removeStorageSync({ key });
};

platformAPI.showActionSheet = (params) => {
  return my.showActionSheet({
    ...params,
    items: params.itemList,
    success: (res: { index: number }) => {
      params.success?.({
        tapIndex: res.index,
      });
    },
  });
};

// TODO 个人小程序不支持该 api.. 先不管
platformAPI.setClipboardData = (params) => {
  return my.setClipboard({
    text: params.data,
    ...params,
  });
};

const info = my.getSystemInfoSync();

PageSpy.client = new Client(
  {
    sdk: 'mp-alipay',
    osType: info.platform.toLowerCase() as SpyClient.OS,
    browserType: 'mp-alipay',
    osVersion: info.system,
    browserVersion: info.version,
    sdkVersion: PKG_VERSION,
    brand: info.brand,
    model: info.model,
  },
  info,
);

SocketStoreBase.messageFilters.push((data) => {
  return data.data;
});

export default PageSpy;
