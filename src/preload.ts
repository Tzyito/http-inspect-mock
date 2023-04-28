/*
 * @Author: tzyito
 * @Date: 2022-11-04
 * @LastEditTime: 2022-12-12
 * @LastEditors: tzyito
 * @Description:
 */

import { contextBridge, ipcRenderer } from "electron";
// const DirList = 'dirList'
(() => {
  contextBridge.exposeInMainWorld("system", {
    dirPath: () => {
      ipcRenderer.send("dirList");
      console.log("发出");
    },
    saveData: (data, path) => {
      ipcRenderer.send("saveData", data, path);
    },
    startInspect: (url: string | string[], response: any) => {
      ipcRenderer.send("startInspect", url, response);
    },
    stopInspect: (url: string) => {
      ipcRenderer.send("stopInspect", url);
    },
    on: (event, cb) => {
      ipcRenderer.on(event, (...args) => {
        cb(args);
      });
    },
  });
})();
