<!--
 * @Author: tzyito
 * @Date: 2022-11-03
 * @LastEditTime: 2022-12-26
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "ToolKitPage",
  setup() {
    const tools = [
      {
        name: "新建菜单",
        icon: "",
        component: [],
      },
      {
        name: "编辑菜单",
        icon: "",
        component: [],
      },
      {
        name: "删除菜单",
        icon: "",
        component: [],
      },
      {
        name: "菜单",
        icon: "",
        component: [],
      },
    ];
    const toolGroups = [];
    let temp = [];
    for (let i = 0; i < tools.length; i++) {
      temp.push(tools[i]);
      if (temp.length === 3 || i === tools.length - 1) {
        toolGroups.push(temp);
        temp = [];
      }
    }

    return { toolGroups };
  },
});
</script>
<template>
  <transition>
    <a-card class="m10">
      <a-row v-for="(tools, index) in toolGroups" :key="index">
        <a-col v-for="(tool, i) in tools" :key="i" :span="8">
          <div class="tool-box">
            {{ tool.name }}
          </div>
        </a-col>
      </a-row>
    </a-card>
  </transition>
</template>

<style lang="scss">
.tool-box {
  width: 150px;
  height: 150px;
  border: 1px solid #f0f0f0;
  transition: border 0.2s;
  &:hover {
    border-color: red;
    cursor: pointer;
  }
}
</style>
