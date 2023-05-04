/*
 * @Author: tzyito
 * @Date: 2022-11-03
 * @LastEditTime: 2022-11-22
 * @LastEditors: tzyito
 * @Description:
 */
import * as VueRouter from "vue-router";
import Layout from "@/views/Home/index.vue";

export const routes: any = [
  {
    path: "/",
    name: "home",
    redirect: { name: "panel" },
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "/panel",
        name: "panel",
        component: () => import("@/views/Home/pages/HomeContainer.vue"),
        children: [
          {
            path: "/data",
            name: "data",
            component: () => import("@/views/Home/pages/mockData/Data.vue"),
          },
          {
            path: "/request",
            name: "request",
            component: () =>
              import("@/views/Home/pages/structToJson/ToJson.vue"),
          },
          {
            path: "/response",
            name: "response",
            component: () =>
              import("@/views/Home/pages/structToJson/ToJson.vue"),
          },
        ],
      },
    ],
    component: Layout,
  },
  {
    path: "/toolkit",
    name: "toolkit",
    redirect: { name: "toolkit-1" },
    meta: {
      title: "工具包管理",
    },
    children: [
      {
        path: "/toolkit-1",
        name: "toolkit-1",
        component: () => import("@/views/ToolKit/index.vue"),
      },
    ],
    component: Layout,
  },
];

export default VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
