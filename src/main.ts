/*
 * @Author: tzyito
 * @Date: 2022-10-28
 * @LastEditTime: 2023-01-17
 * @LastEditors: tzyito
 * @Description:
 */
const { app, BrowserWindow, globalShortcut } = require("electron");
import { ipcMain, ipcRenderer, webContents } from "electron";
import * as fs from "fs";
import * as path from "path";
import { IpcRenderChannel, SystemEvent, InspectEvent } from "./contant/invoke";
import { Inspect } from "./inspect";
import { stringToUint8Array } from "./shared/tools";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const data = fs.readFileSync(path.join(__dirname, "./data.json"));
console.log("数据", data);

let win;
const baseURL = "http://localhost:3000";
// const baseURL = "http://10.9.155.89:3000";
let inspectInstance: Inspect;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  win.loadFile(path.join(__dirname, "../client/dist/index.html"));
  // development
  // win.loadURL("http://localhost:8082");
  const ret = globalShortcut.register("Command+I", () => {
    console.log("Command+I is pressed");
    win.webContents.openDevTools({ mode: "right" });
  });

  if (!ret) {
    console.log("registration failed");
  }

  // windows请求获取请求path列表
  ipcMain.on(SystemEvent.DirList, () => {
    if (win) {
      getPathList();
    }
  });

  // windows请求获取请求path列表
  ipcMain.on(SystemEvent.SaveData, (event, data, path) => {
    if (win) {
      // console.log(typeof data, data, path, "监听到");
      saveData(data, path);
    }
  });

  ipcMain.on(IpcRenderChannel.ShowPathsList, (filePath, list) => {
    console.log(filePath, list, "列表");
  });
  ipcMain.on(InspectEvent.StartInspect, (event, url, response) => {
    if (win) {
      if (inspectInstance) {
        inspectInstance.close();
        inspectInstance.delInspectUrlList(url);
      }
      console.log(url, response, "获取到数据");

      inspectInstance = new Inspect();
      inspectInstance.setInspectUrlList(url);
      console.log(inspectInstance.getInspectUrlList(), "urlList");

      inspectInstance.initInspect({
        beforeSendResponse: (req, res) => {
          const str =
            typeof response !== "string" ? JSON.stringify(response) : response;
          res.response.body = Buffer.from(str, "utf8");
        },
      });
      inspectInstance._onEvent("ready", () => {
        console.log("拦截器ready...");
      });
    }
  });
  ipcMain.on(InspectEvent.StopInspect, (event, url) => {
    if (inspectInstance) {
      inspectInstance.close();
      inspectInstance.delInspectUrlList(url);
    }
  });
};
// 获取路径文件列表
const getPathList = async () => {
  const res = await fetch(`${baseURL}/getPathList`);
  const json = await res.json();
  console.log(json, "响应数据");
  win.webContents.send(IpcRenderChannel.ShowPathsList, json);
};
const saveData = async (data, path) => {
  const params = JSON.stringify({
    data,
    path,
  });
  // console.log(params, "参数");

  const res = await fetch(`${baseURL}/saveData`, {
    method: "POST",
    body: params,
    headers: {
      "content-type": "application/json",
    },
  });
  const json = await res.json();
  console.log("请求ok", json);
};
const editorPath = async () => {
  const res = await fetch(`${baseURL}/editorPaht`);
  const json = await res.json();
};

app.whenReady().then(() => {
  createWindow();
});
