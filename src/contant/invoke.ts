/*
 * @Author: tzyito
 * @Date: 2022-11-04
 * @LastEditTime: 2022-12-12
 * @LastEditors: tzyito
 * @Description:
 */
export enum SystemEvent {
  DirList = "dirList", // 操作目录
  SaveData = "saveData", // 保存数据
}

export enum IpcRenderChannel {
  ShowPathsList = "showPathsList", // 获取路径列表
}

export enum InspectEvent {
  StartInspect = "startInspect", // 开始拦截url
  StopInspect = "stopInspect", // 终止拦截url
}
