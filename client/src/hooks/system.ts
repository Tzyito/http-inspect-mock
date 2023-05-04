/*
 * @Author: tzyito
 * @Date: 2022-11-07
 * @LastEditTime: 2022-12-12
 * @LastEditors: tzyito
 * @Description:
 */

import { IpcRenderChannel } from "@/contant/invoke";
import { Menu } from "@/interface/menu";
import { Ref } from "vue";
const win: any = window;
class System {
  getPathList() {
    return win.system.dirPath();
  }
  saveData(data: string, path: string) {
    return win.system.saveData(data, path);
  }
  startInspect(url: string | string[], response: any) {
    win.system.startInspect(url, response);
  }
  stopInspect() {
    win.system.stopInspect();
  }
  on(event: string, cb: (...arg: any) => any) {
    return win.system.on(event, cb);
  }
}
export const useGetPathList = (): Promise<{ menus: Menu[] }> => {
  return new Promise((res) => {
    let menus: Menu[] = [];
    const system = new System();
    system.on(IpcRenderChannel.ShowPathsList, (val: any) => {
      console.log("获取到菜单: ", val[1]);
      menus = val[1];
      res({
        menus,
      });
    });
    system.getPathList();
  });
};

export const saveStructData = (data: string, path: string) => {
  return new Promise((res) => {
    const system = new System();
    system.saveData(data, path);
    res(true);
  });
};

export const startInspect = (url: string[] | string, response: any) => {
  return new Promise((res) => {
    const system = new System();
    system.startInspect(url, response);
    res(true);
  });
};

export const stopInspect = () => {
  return new Promise((res) => {
    const system = new System();
    system.stopInspect();
    res(true);
  });
};
