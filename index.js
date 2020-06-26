import { ipcRenderer } from "electron";

const VueIPC = Object.create(null);

// 主要目的是将ipcRenderer这个对象挂载到Vue原型链上
VueIPC.install = Vue => {
  Vue.prototype.$ipcRenderer = {
    send: (method, url, body) => {
      ipcRenderer.send("CLIENT_NORMAL_MSG", {
        method, // 数据请求类型 如GET/POST/DELETE/HEAD
        url, // 请求的服务端的URL
        body: body ? JSON.stringify(body) : null// 可选参数body
      });

    },
    once: (event, callback) => {
      ipcRenderer.once("SERVER_NORMAL_MSG", (event, args) => {
        callback(args)
      })
    }
  }
  // 监听主进程的消息
}

export default VueIPC


