<script lang="ts">
import { defineComponent, reactive, ref, toRefs, unref } from "vue";
import SubMenu from "./SubMenu.vue";
import type { MenuProps } from "ant-design-vue";
import { Menu } from "@/interface/menu";
import { useRouter } from "vue-router";
import { CURRENTMENU, MENUS, STRUCTDATA } from "@/contant/localStorage";

export default defineComponent({
  name: "MenusTree",
  components: {
    SubMenu,
  },
  props: ["menus"],
  setup(props) {
    const myMenus = toRefs(props).menus;
    const router = useRouter();
    console.log("菜单", unref(myMenus));
    window.localStorage.setItem(MENUS, JSON.stringify(unref(myMenus)));

    const state = reactive({
      selectedKeys: [myMenus.value[0].id] as string[],
      openKeys: [myMenus.value[0].id] as string[],
      rootSubmenuKeys: myMenus.value.map((element: Menu) => element.id),
    });

    const dfs = (menus: any, ids: string[], i = 0) => {
      const target = menus.find((menu: Menu) => menu.id === ids[i]);
      if (target.children) {
        dfs(target.children, ids, i + 1);
      } else {
        return window.localStorage.setItem(CURRENTMENU, JSON.stringify(target));
      }
    };
    const handleClick: MenuProps["onClick"] = (e) => {
      const menus = JSON.parse(window.localStorage.getItem(MENUS) as string);
      dfs(menus, e.keyPath as string[]);
      // console.log(targetMenu, '23123')

      // 可通过sub-menus中的a-menu-item注入数据，通过e获取
      state.selectedKeys = [e.eventKey] as string[];
      window.localStorage.setItem(STRUCTDATA, e.item.data);
      const routerNamemap = {
        数据: "data",
        请求参数: "request",
        响应参数: "response",
      };
      router.push({
        name: (routerNamemap as any)[e.item.name],
      });
    };
    const onOpenChange = (openKeys: string[]) => {
      console.log("open: ", openKeys);

      const latestOpenKey = openKeys.find((key) => {
        state.openKeys.indexOf(key) === -1;
      });

      if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };
    const handleMenus = (option: "add" | "editor" | "remove") => {
      console.log(option);
    };
    return {
      ...toRefs(state),
      myMenus,
      handleClick,
      onOpenChange,
      handleMenus,
    };
  },
});
</script>

<template>
  <div class="menus">
    <div class="menus-option mt10 mb10">
      <a-button size="small" @click="handleMenus('add')">新增菜单</a-button>
      <a-button size="small" @click="handleMenus('editor')">编辑菜单</a-button>
      <a-button size="small" @click="handleMenus('remove')">删除菜单</a-button>
    </div>
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 256px; height: 100vh"
      mode="inline"
      @click="handleClick"
      @openChange="onOpenChange"
    >
      <template v-for="(item, index) in myMenus" :key="index">
        <template v-if="item.children">
          <SubMenu :key="item.id" :menu="item"></SubMenu>
        </template>
        <template v-else>
          <a-menu-item :key="item.id">{{ item.name }}</a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>
