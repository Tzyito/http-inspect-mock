/*
 * @Author: tzyito
 * @Date: 2022-11-10
 * @LastEditTime: 2022-11-14
 * @LastEditors: tzyito
 * @Description:
 */
export interface BaseJson {
  [key: string]: ItemJson[];
}
export interface ItemJson {
  id: string;
  key: string;
  value: any;
  des: string;
  type: JsonType;
  children?: ItemJson[];
}

export enum JsonType {
  /** 未知类型 */
  unknownType = "unknownType",
  /** 基础类型 */
  baseType = "baseType",
  /** 自定义类型 */
  customType = "customType",
}
