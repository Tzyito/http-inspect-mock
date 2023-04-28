/*
 * @Author: tzyito
 * @Date: 2023-01-17
 * @LastEditTime: 2023-01-17
 * @LastEditors: tzyito
 * @Description:
 */
export function uint8ArrayToString(fileData: Uint8Array) {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString;
}
export function stringToUint8Array(str: string) {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array;
}
