import PageSpy, { Client } from './base';
import { SpyClient } from '@huolala-tech/page-spy-types';
import { wrapper } from './wrapper';
import device from '@system.device';
import { setMPSDK } from './helpers/mp-api';

const info = {
  platform: 'android',
  system: 'system',
  version: 'version',
  osName: 'osName',
  osVersion: 'osVersion',
};
PageSpy.client = new Client(
  {
    osType: info.platform as SpyClient.OS,
    sdk: 'mp-wechat',
    browserType: 'mp-wechat',
    osVersion: info.osVersion,
    browserVersion: info.version,
    isDevTools: info.platform === 'devtools',
    sdkVersion: PKG_VERSION,
  },
  info,
);

const SpyPlugin = {
  init(api: string, project: string) {
    return {
      // 安装入口
      //@ts-ignore
      install(VmClass) {
        // 页面生命周期
        VmClass.mixin({
          onInit() {
            try {
              //PageSpy.instance?.myUseOldConnection()
              console.log(
                'pageSpy socket state',
                PageSpy.instance?.socketStore.getSocket().getState(),
              );
            } catch (e) {
              console.error(e);
            }

            // console.info(`页面生命周期：onInit`)
          },
          onReady() {
            //console.info(`页面生命周期：onReady`)
          },
          onShow() {},
          onHide() {
            // console.info(`页面生命周期：onHide`)
          },
        });

        // 应用生命周期
        VmClass.mixinApp({
          onCreate() {
            //包装下.
            //@ts-ignore
            wrapper(global);
            //@ts-ignore
            setMPSDK(global);
            console.info(`应用生命周期：onCreate`);
            device.getUserId({
              success: function (data) {
                new PageSpy({
                  api: api,
                  clientOrigin: 'http://' + api,
                  enableSSL: false,
                  project: project,
                  title: data.userId,
                });
              },
            });
          },
          onShow() {
            console.info(`应用生命周期:onShow`);
          },
        });
      },
    };
  },
};
export default SpyPlugin;
