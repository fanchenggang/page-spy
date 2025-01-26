# `page-spy-quick`

## `用于调试快应用的 [PageSpy](https://www.pagespy.org) 客户端 SDK.`

## 使用

> npm i page-spy-quick

```js
//修改 app.ux

import SpyPlugin from 'page-spy-quick';

plugins: [SpyPlugin.init('192.168.31.127:6752', '程序名称')];
```

```js
//修改 api/index.js(如有,没有就找到调用fetch.fetch的地方进行修改)

// 使用 global.request 代替 fetch.fetch

//示例:

promisic(global.request)(options).then((response) =>{
const content =response.data
//  ...
//替换

fetch.fetch(options).then((response) => {
  const result = response.data
  const content =result.data
//...
```
