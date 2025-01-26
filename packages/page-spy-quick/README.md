## Usage

```js
app.ux;
import SpyPlugin from './spy/index';

plugins: [SpyPlugin.init('192.168.31.127:6752', '枫叶剧场')];
```

```js
api/index.js

//使用

promisic(global.request)(options).then((response) =>{
const content =response.data

//替换

fetch.fetch(options).then((response) => {
  const result = response.data
  const content =result.data
```
