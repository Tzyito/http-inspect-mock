<!--
 * @Author: tzyito
 * @Date: 2022-12-13
 * @LastEditTime: 2022-12-13
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import type { Ref } from "vue";
import JsonViewer from "vue-json-viewer";

export default defineComponent({
  props: {
    value: {
      default: "",
      type: String,
    },
  },
  components: { JsonViewer },
  setup(props, { emit, attrs }) {
    const jsonData = ref("");
    const handleChangeInput = (e: InputEvent) => {
      const val = ((e as InputEvent).target as HTMLInputElement).value;
      console.log(((e as InputEvent).target as HTMLInputElement).value, "3232");

      const isJson = (str: string) => {
        try {
          const json = JSON.parse(str);

          if (json && typeof json === "object") {
            return true;
          }
        } catch {
          return false;
        }
      };
      jsonData.value = val;
    };
    return {
      jsonData,
      handleChangeInput,
    };
  },
});
</script>
<template>
  <a-row>
    <a-col :span="12">
      <div class="json-data">
        <JsonViewer :value="jsonData" copyable></JsonViewer>
      </div>
    </a-col>
  </a-row>
</template>
