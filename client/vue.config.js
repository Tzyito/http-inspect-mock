/*
 * @Author: tzyito
 * @Date: 2022-11-02
 * @LastEditTime: 2023-01-30
 * @LastEditors: tzyito
 * @Description:
 */
const { defineConfig } = require("@vue/cli-service");
const MonacoPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config(path.join(__dirname, "../env"));

module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "http拦截器";
      return args;
    });
    config.plugin("monaco").use(new MonacoPlugin());
  },
  devServer: {
    port: process.env.PORT,
  },
});
