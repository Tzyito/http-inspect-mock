<!--
 * @Author: tzyito
 * @Date: 2022-11-03
 * @LastEditTime: 2022-11-22
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import Menus from "@/components/menus.vue";
import { useGetPathList } from "@/hooks/system";
import { Bus, injectBusKey } from "@/eventBus/eventBus";
import { EVENT } from "@/eventBus/eventEnum";
import { MENUS } from "@/contant/localStorage";
export default defineComponent({
  name: "PanlelPage",
  components: {
    Menus,
  },
  async setup() {
    const bus = inject(injectBusKey) as Bus;
    bus.on(EVENT.CHANGE_MENUS, async (data: any) => {
      const { menus } = await useGetPathList();
      menu.value = menus;
      window.localStorage.setItem(MENUS, JSON.stringify(menus));
    });
    const { menus } = await useGetPathList();
    const menu = ref(menus);

    return {
      menu,
    };
  },
});
</script>
<template>
  <div class="layout">
    <Menus :menus="menu"></Menus>
    <div class="right">
      <RouterView :key="$route.fullPath"></RouterView>
    </div>
  </div>
</template>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: row;
  .right {
    height: 100vh;
    overflow-y: scroll;
    flex: 1;
  }
}
</style>
