/*
 * @Author: tzyito
 * @Date: 2022-11-02
 * @LastEditTime: 2023-01-17
 * @LastEditors: tzyito
 * @Description:
 */
import { ProxyOptions, RequestDetail, ResponseDetail } from "anyproxy";
import * as path from "path";
const dotenv = require("dotenv");
dotenv.config(path.join(__dirname, "../env"));

const AnyProxy = require("anyproxy");

// Modify the user agent for all requests to the following urls.
const filter = {
  urls: ["http://localhost:8881/api/customers/list-customers"],
};
console.log("prot: ", process.env.PORT);

const defaultOptions: ProxyOptions = {
  port: process.env.PORT, // 这里填要拦截的前端server的端口
  // rule: require('myRuleModule'),
  webInterface: {
    enable: true,
    webPort: 8002,
  },
  throttle: 10000,
  forceProxyHttps: false,
  wsIntercept: false, // 不开启websocket代理
  silent: false,
};

export class Inspect {
  mockList = [];
  proxyServer = null;
  options: ProxyOptions = defaultOptions;
  constructor(options?) {
    if (options) {
      this.options = options;
    }
  }
  initInspect({
    beforeSendRequest = null,
    beforeSendResponse = null,
    success = null,
    onRecord = null,
  }) {
    if (!this.proxyServer) {
      const getMockList = this.getInspectUrlList();

      this.options.rule = {
        *beforeSendRequest(requestDetail: RequestDetail): any {
          if (beforeSendRequest) {
            return beforeSendRequest(requestDetail);
          }
          return requestDetail;
        },
        *beforeSendResponse(
          requestDetail: RequestDetail,
          responseDetail: ResponseDetail
        ): any {
          console.log("请求urlList: ", getMockList);
          console.log("请求的url: ", getMockList);

          if (beforeSendResponse && getMockList.includes(requestDetail.url)) {
            console.log("拦截该url: ", requestDetail.url);
            return beforeSendResponse(requestDetail, responseDetail);
          }
          return responseDetail;
        },
      };
      this.proxyServer = new AnyProxy.ProxyServer(this.options);
      this.proxyServer.on("ready", () => {
        console.log("启动完成");
        success && success(this.proxyServer);
      });
    }
    this.proxyServer.start();
  }
  /** 拦截url列表 */
  getInspectUrlList(): string[] {
    return this.mockList;
  }
  /** 设置拦截url列表 */
  setInspectUrlList(url: string) {
    this.mockList.push(url);
  }
  /** 将某个url从拦截器中删除 */
  delInspectUrlList(url: string) {
    this.mockList = this.mockList.filter((mockUrl: string) => mockUrl !== url);
  }
  start() {}
  close() {
    this.proxyServer.close();
  }
  _onEvent(event: "ready" | "error", cb) {
    this.proxyServer.on(event, cb);
  }
}
