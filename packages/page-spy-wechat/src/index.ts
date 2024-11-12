import PageSpyMPBase, { setMPSDK } from '@huolala-tech/page-spy-mp-base';
import { SpyClient, SpyMP } from '@huolala-tech/page-spy-types';

declare const wx: MPSDK;

setMPSDK(wx);

const info = wx.getSystemInfoSync();
const [osName, osVersion] = info.system.toLowerCase().split(' ');

class PageSpy extends PageSpyMPBase {
  constructor(init: SpyMP.MPInitConfig) {
    super(init, {
      osType: (info.platform !== 'devtools' // NOTE: 小程序独有
        ? info.platform.toLowerCase()
        : osName) as SpyClient.OS,
      sdk: 'mp-wechat',
      browserType: 'mp-wechat',
      osVersion: osVersion,
      browserVersion: info.version,
      isDevTools: info.platform === 'devtools',
      sdkVersion: PKG_VERSION,
    });
  }
}

export default PageSpy;
