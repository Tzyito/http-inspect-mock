/*
 * @Author: tzyito
 * @Date: 2022-12-13
 * @LastEditTime: 2022-12-13
 * @LastEditors: tzyito
 * @Description:
 */

export const isJson = (str: string) => {
  try {
    const json = JSON.parse(str);
    if (json && typeof json === "object") {
      return true;
    }
  } catch {
    return false;
  }
};
