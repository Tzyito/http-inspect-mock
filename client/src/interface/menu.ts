/*
 * @Author: tzyito
 * @Date: 2022-11-04
 * @LastEditTime: 2022-11-21
 * @LastEditors: tzyito
 * @Description:
 */
export interface Menu {
  name: string;
  id: string;
  type: string;
  path: string;
  children?: MenuItem[];
}
export interface MenuItem {
  name: string;
  id: string;
  type: string;
  path: string;
  children: MenuPath[];
}
export interface MenuPath {
  name: string;
  id: string;
  data: string;
  path: string;
  type: string;
}
