const fs = require("fs");
const path = require("path");
const obj = {
  code: 102,
  msg: "success",
};
fs.writeFileSync(
  path.join(__dirname, "./paths/护架/新增接口/response.json"),
  JSON.stringify(obj)
);
