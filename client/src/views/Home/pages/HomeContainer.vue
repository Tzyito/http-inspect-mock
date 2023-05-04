<script lang="ts">
import { defineComponent } from "vue";
import PanlelPage from "./Panel.vue";
export default defineComponent({
  name: "HomeContainer",
  components: {
    PanlelPage,
  },
});
</script>

<template>
  <Suspense>
    <PanlelPage></PanlelPage>
  </Suspense>
</template>
