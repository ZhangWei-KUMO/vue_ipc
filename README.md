# vue_ipc

A IPC Render Plugin for vue + electron, you can simply communicate with electron main process, just like ajax。


## Install

```bash
npm run install vue_ipc
# or
yarn add vue_ipc
```

## Usage

Firstly, import your Vue project:

```js
// main.js 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueIPC from 'vue_ipc';

+ Vue.use(VueIPC);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

You can use `$ipcRenderer` object to send and listen message:

```js
export default {
  name: "Home",
  data() {
    return {
      loading: false,
      error: null
    };
  },
  created() {
  // send message to main process
+  this.$ipcRenderer.send("GET", "/video/list?type=history");
   // listen response message from main process 
+ this.$ipcRenderer.once("SERVER_NORMAL_MSG", data => {
        this.videos = data.video;
      });
  }
};
```

The edit Electron `main.js/background.js`,like this:

```js
import { ipcMain } from 'electron';
import axios from 'axios';

const API_ADDRESS = "https:www.xxx.com/api";

  ipcMain.on("CLIENT_NORMAL_MSG", async (event, arg) => {
    let remote_url = `${API_ADDRESS}${arg.url}`;
    try {
      let res = await axios.get(remote_url);
      if (res.status === 200) {
        event.reply("SERVER_NORMAL_MSG", res.data)
      }
    } catch (e) {
      event.reply(SERVER_NORMAL_MSG, {
        success: false,
        error: `server error code: ${e.status} msg: ${e.message}`
      })
    }
  })
```

## Methods
| Method | type | Description                                                                                                    |
| :----- | :--- | :------------------------------------------------------------------------------------------------------------- |
| send   | func | Send message to electron main process from render process, accept `method`,`URL`,`body` three arguments        |
| once   | func | listen message from electron main process to render process, accept a  signal argument and a callback function |

## Send Function Arguments

| Name   | type    | Description                                                          |
| :----- | :------ | :------------------------------------------------------------------- |
| method | :String | Normal HTTP Request methods                                          |
| URL    | String  | api url                                                              |
| body   | Object  | This is an optional argument,if you use GET method,you can ignore it |

