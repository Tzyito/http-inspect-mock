<!--
 * @Author: tzyito
 * @Date: 2022-11-07
 * @LastEditTime: 2022-11-14
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { defineComponent } from "vue";
import { FolderOpenOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "SubMenu",
  components: { FolderOpenOutlined },
  props: ["menu"],
});
</script>

<template>
  <a-sub-menu :key="menu.id">
    <template #icon>
      <folder-open-outlined />
    </template>
    <template #title>{{ menu.name }}</template>
    <div v-for="(item, index) in menu.children" :key="index">
      <template v-if="item.children">
        <SubMenu :key="item.id" :menu="item"></SubMenu>
      </template>
      <template v-else>
        <a-menu-item :key="item.id" :data="item.data" :name="item.name">{{
          item.name
        }}</a-menu-item>
      </template>
    </div>
  </a-sub-menu>
</template>
