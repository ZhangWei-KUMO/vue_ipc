# vue_ipc
A IPC Render Plugin for vue + electron 


## Install
```
npm run install vue_ipc
yarn add vue_ipc
```
## Usage

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

```js
// Home.vue
export default {
  name: "Home",
  data() {
    return {
      loading: false,
      videos: [],
      error: null
    };
  },
  created() {
    this.startRequest();
    this.onRequestBack();
  },
  methods: {
    startRequest() {
      this.$ipcRenderer.send("GET", "/video/list?type=history");
    },
    onRequestBack() {
      this.$ipcRenderer.once("SERVER_NORMAL_MSG", data => {
        this.videos = data.video;
      });
    }
  }
};
```

```js
// Electron main.js/background.js
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
## 