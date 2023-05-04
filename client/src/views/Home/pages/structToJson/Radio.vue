<!--
 * @Author: tzyito
 * @Date: 2022-11-09
 * @LastEditTime: 2022-11-24
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { RadioChangeEvent } from "ant-design-vue";
import { defineComponent, ref, toRefs, unref } from "vue";

export default defineComponent({
  name: "RadioPage",
  props: ["radioGroup"],
  setup(props, { emit }) {
    const { radioGroup } = toRefs(props);
    const group = ref<string[]>([]);
    for (let [key, value] of Object.entries(unref(radioGroup))) {
      group.value.push(key);
    }
    const handleEmitChange = (e: RadioChangeEvent) => {
      emit("radio-change", e.target.value);
    };
    const value = ref<string>("");
    return {
      value,
      group,
      handleEmitChange,
    };
  },
});
</script>
<template>
  <a-radio-group v-model:value="value" @change="handleEmitChange">
    <a-radio v-for="(value, index) in group" :key="index" :value="value">{{
      value
    }}</a-radio>
  </a-radio-group>
</template>
