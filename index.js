import { ipcRenderer } from "electron";

const VueIPC = Object.create(null);

function checkMethod(method) {
  const methods = ["GET", "POST", "DELETE", "HEAD"];
  if (methods.indexOf(method) > -1) {
    return method;
  } else {
    throw Error("Your method name is invalid,please input correct method name")
  }
}

function checkUrl(url) {
  if (val === null || typeof url !== 'string') {
    throw Error("Please input valid URL route!")
  };
  return url
}
function isObject(val) {
  if ((typeof val === 'function') || (typeof val === 'object')) {
    return true
  } else {
    throw Error("body argument should be a Object Type!")
  }
}

VueIPC.install = Vue => {
  Vue.prototype.$ipcRenderer = {
    send: (method, url, body) => {
      if (!checkMethod(method)) {
        return;
      }
      ipcRenderer.send("CLIENT_NORMAL_MSG", {
        method: checkMethod(method),
        url: checkUrl(url),
        body: body ? JSON.stringify(isObject(body)) : null// 可选参数body
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


