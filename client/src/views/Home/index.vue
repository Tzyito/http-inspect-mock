<!--
 * @Author: tzyito
 * @Date: 2022-11-03
 * @LastEditTime: 2022-11-03
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { defineComponent, ref } from "vue";
import Header from "./Header.vue";
import Container from "./Container.vue";
export default defineComponent({
  components: {
    Header,
    Container,
  },

  setup() {
    const current = ref<string[]>(["mail"]);
    return {
      current,
    };
  },
});
</script>

<template>
  <Header></Header>
  <Container></Container>
</template>
