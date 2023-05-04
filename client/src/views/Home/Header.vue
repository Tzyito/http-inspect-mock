<!--
 * @Author: tzyito
 * @Date: 2022-11-03
 * @LastEditTime: 2022-11-08
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "HeaderPage",

  setup() {
    const current = ref<string[]>(["main"]);

    return {
      current,
    };
  },
});
</script>

<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal">
    <a-menu-item key="main" @click="$router.push('/')">首页</a-menu-item>
    <a-menu-item key="toolkit" @click="$router.push('/toolkit')"
      >工具包</a-menu-item
    >
  </a-menu>
</template>
