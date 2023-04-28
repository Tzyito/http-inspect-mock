/*
 * @Author: tzyito
 * @Date: 2022-11-07
 * @LastEditTime: 2022-12-12
 * @LastEditors: tzyito
 * @Description:
 */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fileMap = {
  "data.json": "数据",
  "request.json": "请求参数",
  "response.json": "响应参数",
};
const readDirFileList = (abPath, subId = "1") => {
  const files = fs.readdirSync(path.join(__dirname, abPath), {
    withFileTypes: true,
  });
  let temp = [];
  if (!files.length) return [];

  files.forEach((item, index) => {
    if (item.isDirectory()) {
      temp.push({
        name: item.name,
        id: `${subId}-${index}`,
        type: "sub-menu",
        path: abPath + "/" + item.name,
        children: readDirFileList(
          abPath + "/" + item.name,
          `${subId}-${index}`
        ),
      });
    } else {
      const file = fs.readFileSync(
        path.join(__dirname, abPath + "/" + item.name),
        "utf-8"
      );
      console.log(abPath + "/" + item.name, fileMap[item.name], "423321");
      temp.push({
        name: fileMap[item.name],
        id: `${subId}-${index}`,
        type: "menu-item",
        path: abPath + "/" + item.name,
        data: JSON.stringify(file),
      });
    }
  });
  return temp;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.get("/getPathList", (req, res, next) => {
  const list = readDirFileList("./paths");
  res.json(list);
});

app.post("/saveData", (req, res, next) => {
  //   console.log(req.body);
  const { data, path: p } = req.body;
  fs.writeFileSync(path.join(__dirname, p), data);
  console.log("saveData ==== 保存数据");
  res.json("200");
});

app.listen(3000, () => {
  console.log("express start! & listen to port 3000");
});
