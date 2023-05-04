/*
 * @Author: tzyito
 * @Date: 2022-11-02
 * @LastEditTime: 2023-01-30
 * @LastEditors: tzyito
 * @Description:
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import "ant-design-vue/dist/antd.css";
import "@/assets/style/index.scss";
import Antd from "ant-design-vue";
import { EventBus, injectBusKey } from "./eventBus/eventBus";
// import '@/components/monaco/worker.js'

const app = createApp(App);
const Bus = new EventBus();
app.provide(injectBusKey, Bus);
app.use(router);
app.use(Antd);
app.mount("#app");
