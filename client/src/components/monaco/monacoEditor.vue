<!--
 * @Author: tzyito
 * @Date: 2023-01-30
 * @LastEditTime: 2023-01-30
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { defineComponent, nextTick, unref, watch } from "vue";
import * as monaco from "monaco-editor";
export default defineComponent({
  name: "MonacoEditor",
  props: {
    code: {
      type: String,
      defalut: "",
    },
    language: {
      type: String,
      default: "json",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 300,
    },
    theme: {
      type: String,
      default: "vs",
    },
  },
  setup(props) {
    const { language, theme, readOnly, code } = unref(props);
    let monacoInstance: monaco.editor.IStandaloneCodeEditor;
    const initEditor = () => {
      nextTick(() => {
        monacoInstance = monaco.editor.create(
          document.querySelector(".monaco-editor-container") as HTMLElement,
          {
            language,
            theme,
            readOnly,
            value: code,
            lineNumbers: "off",
          }
        );
      });
    };

    initEditor();
    watch(
      () => code,
      (val: any) => {
        console.log(val);

        monacoInstance.setValue(val);
      }
    );
    return {};
  },
});
</script>

<template>
  <div class="monaco-editor-container" :style="{ height: `${height}px` }"></div>
</template>
