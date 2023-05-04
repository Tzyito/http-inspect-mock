<!--
 * @Author: tzyito
 * @Date: 2022-11-14
 * @LastEditTime: 2023-01-30
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { startInspect, stopInspect } from "@/hooks/system";
import { message } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import JsonViewer from "vue-json-viewer";
import { isJson } from "@/utils/isJson";
import MonacoEditor from "@/components/monaco/monacoEditor.vue";

export default defineComponent({
  name: "DataPage",
  components: { JsonViewer, MonacoEditor },
  setup() {
    const route = useRoute();
    console.log("route：", route);
    const state = ref({
      url: "",
      inputArea: "",
      jsonData: {},
    });
    const listenerPaste = (e: ClipboardEvent) => {
      e.clipboardData?.items[0].getAsString((str) => {
        console.log(str, "粘贴");
        if (!isJson(str)) return;
        state.value.inputArea = JSON.stringify(JSON.parse(str), null, 4);
        console.log(state.value.inputArea, "数据");

        state.value.jsonData = JSON.parse(str);
      });
    };

    const handleChangeInput = (e: InputEvent) => {
      const val = ((e as InputEvent).target as HTMLInputElement).value;
      console.log(state.value.inputArea, isJson(state.value.inputArea));

      if (isJson(state.value.inputArea)) {
        state.value.jsonData = JSON.parse(state.value.inputArea);
      }
    };

    const handleStop = async () => {
      await stopInspect();
      message.success("停止监测");
    };
    const handleInspect = async () => {
      console.log(JSON.parse(state.value.inputArea), "数据");
      if (!state.value.url) return message.error("请填写url");
      await startInspect(state.value.url, JSON.parse(state.value.inputArea));
      message.success("开始监测");
    };
    onMounted(() => {
      const el = document.querySelector("#editor") as HTMLElement;
      el.addEventListener("paste", listenerPaste);
    });
    return {
      state,
      // ...toRefs(state),
      listenerPaste,
      handleStop,
      handleInspect,
      handleChangeInput,
    };
  },
});
</script>

<template>
  <a-card>
    <a-row class="mb10">
      <a-col :span="12">
        <span>请输入url:</span>
        <a-input v-model:value="state.url"></a-input>
      </a-col>
    </a-row>
    <a-row class="mb10">
      <a-col :span="12">
        <MonacoEditor id="editor" v-model:code="state.inputArea"></MonacoEditor>

        <!-- <a-textarea
          class="textarea"
          v-model:value="inputArea"
          @change="handleChangeInput"
          @paste="listenerPaste"
          placeholder="write data in golang struct"
          :rows="10"
          style="white-space: nowrap"
        /> -->
      </a-col>
      <a-col :span="12" class="json-data">
        <JsonViewer :value="state.jsonData" copyable></JsonViewer>
      </a-col>
    </a-row>
    <a-row>
      <div class="mt10">
        <a-button class="mr10" danger @click="handleStop">停止拦截</a-button>
        <a-button type="primary" @click="handleInspect">拦截该url</a-button>
      </div>
    </a-row>
  </a-card>
</template>

<style lang="scss">
.json-data {
  height: 230px;
  overflow-y: scroll;
}
</style>
