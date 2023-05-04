<!--
 * @Author: tzyito
 * @Date: 2022-11-08
 * @LastEditTime: 2023-01-17
 * @LastEditors: tzyito
 * @Description: 
-->
<script lang="ts">
import {
  computed,
  createVNode,
  defineComponent,
  getCurrentInstance,
  inject,
  reactive,
  ref,
  unref,
  UnwrapRef,
} from "vue";
import type { ComponentInternalInstance } from "vue";
import { RightOutlined } from "@ant-design/icons-vue";
import { useTransferStructToJson } from "@/hooks/transferJson";
import { BaseJson, ItemJson, JsonType } from "@/interface/toJson";
import JsonViewer from "vue-json-viewer";
import { CURRENTMENU, MENUS, STRUCTDATA } from "@/contant/localStorage";
import { message, Modal } from "ant-design-vue";
import { saveStructData, useGetPathList } from "@/hooks/system";
import { Bus, injectBusKey } from "@/eventBus/eventBus";
import { EVENT } from "@/eventBus/eventEnum";
import Radio from "./Radio.vue";

export default defineComponent({
  name: "ToJson",
  components: { RightOutlined, JsonViewer },
  setup() {
    const curData = JSON.parse(
      window.localStorage.getItem(STRUCTDATA) as string
    );
    const appContext = (getCurrentInstance() as ComponentInternalInstance)
      .appContext;
    const structData = ref<string>(curData);
    const jsonData = ref<string>(""); // 结构体列表数据
    const trigger = ref<boolean>(false);
    let jsonList = ref<string[]>([]); // 结构体列表
    let tableDatas = ref<BaseJson>({});
    const editableData: UnwrapRef<Record<string, ItemJson>> = reactive({}); // 拷贝数据
    const expandedRowKeys = ref<string[]>([]);

    const bus = inject(injectBusKey) as Bus;

    const columns = [
      {
        title: "键",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "值",
        dataIndex: "value",
        key: "value",
      },
      {
        title: "描述",
        dataIndex: "des",
        key: "des",
      },
      {
        title: "编辑",
        dataIndex: "operation",
      },
    ];
    // 转换struct
    const handleTransfer = () => {
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
      try {
        if (isJson(structData.value)) {
          tableDatas.value = JSON.parse(structData.value) as any;
        } else {
          const { structMap, structNameList } = useTransferStructToJson(
            unref(structData)
          );
          console.log(structMap, structNameList, "map");

          jsonList.value = structNameList;
          tableDatas.value = structMap;
        }
      } catch (e) {
        console.log("e", e);
        message.error("请检测格式，目前只支持golang struct & json 格式");
      }
    };
    // 展示表格
    const handleParseJson = () => {
      trigger.value = true;
    };

    // 导出表格转为http请求数据
    const handleExportJson = () => {
      const obj: any = {};
      for (let [key, value] of Object.entries(tableDatas.value)) {
        obj[key] = getBaseDataStruct(value);
      }
      let selectRadio = "";

      Modal.info({
        title: "请确认需要导出的字段",
        content: createVNode(Radio, {
          radioGroup: obj,
          onRadioChange: (val: string) => {
            selectRadio = val;
          },
        }),
        onOk: () => {
          message.success(`${selectRadio} 字段已复制进剪切板`);
          navigator.clipboard.writeText(JSON.stringify(obj[selectRadio]));
        },
        appContext,
      });
    };
    const dfs = (menu: any, ids: string[]) => {
      if (ids.length === 1) {
        return menu;
      }
      if (menu.id === ids[0]) {
        for (let subMenu of menu.children) {
          dfs(subMenu, ids.slice(1));
        }
      }
    };
    const handleSaveStruct = async () => {
      const menuData = JSON.parse(
        window.localStorage.getItem(CURRENTMENU) as string
      );
      console.log(structData.value, menuData.path, "数据");
      await saveStructData(structData.value, menuData.path);
      bus.emit(EVENT.CHANGE_MENUS);
      message.success("结构体保存成功！下一次可直接打开");
    };

    // 获取基础数据结构
    const getBaseDataStruct = (val: ItemJson[]) => {
      let obj: any = {};
      for (let item of val) {
        if (item.type === JsonType.customType) {
          obj[item.key] = getBaseDataStruct(item.children as ItemJson[]);
        } else {
          obj[item.key] = item.value;
        }
      }
      return obj;
    };

    const edit = (id: string, targetStruct: string) => {
      editableData[id] = JSON.parse(
        JSON.stringify(
          tableDatas.value[targetStruct].filter((item) => {
            if (id && id === item.id) {
              return item;
            } else {
              item.children?.find((it) => id === it.id);
              return item;
            }
          })[0]
        )
      );
    };
    const save = (id: string, targetStruct: string) => {
      Object.assign(
        tableDatas.value[targetStruct].filter((item) => {
          if (id && id === item.id) {
            return item;
          } else {
            item.children?.find((it) => id === it.id);
            return item;
          }
        })[0],
        editableData[id]
      );
      delete editableData[id];
    };
    const cancel = (id: string) => {
      delete editableData[id];
    };

    handleTransfer();
    handleParseJson();
    return {
      structData,
      jsonData,
      jsonList,
      tableDatas,
      trigger,
      columns,
      expandedRowKeys,
      editableData,
      handleTransfer,
      handleParseJson,
      handleExportJson,
      handleSaveStruct,
      edit,
      save,
      cancel,
    };
  },
});
</script>

<template>
  <a-card>
    <a-row class="json-header">
      <a-col :span="10">
        <a-textarea
          v-model:value="structData"
          placeholder="write data in golang struct"
          :rows="10"
          style="white-space: nowrap"
        />
      </a-col>
      <a-col :span="4" class="ma tac">
        <a-button type="primary" @click="handleTransfer">
          <template #icon><right-outlined /></template>
          转换
        </a-button>
      </a-col>
      <a-col :span="10">
        <!-- <a-textarea v-model:value="jsonData" placeholder="write data in json" :rows="10" /> -->
        <div class="json-data">
          <JsonViewer :value="tableDatas" copyable></JsonViewer>
        </div>
      </a-col>
    </a-row>
    <div class="df jcc mt20">
      <a-button type="primary" class="mr10" @click="handleParseJson"
        >解析JSON生成</a-button
      >
      <a-button type="primary" class="mr10" @click="handleExportJson"
        >导出</a-button
      >
      <a-button type="primary" @click="handleSaveStruct">保存数据</a-button>
    </div>
    <template v-if="trigger">
      <template v-for="(item, index) in jsonList" :key="index">
        <a-table :dataSource="tableDatas[item]" :columns="columns">
          <template #bodyCell="{ column, text, record }">
            <template v-if="['key', 'value', 'des'].includes(column.dataIndex)">
              <div>
                <a-input
                  v-if="editableData[record.id]"
                  v-model:value="(editableData[record.id] as any)[column.dataIndex]"
                  style="margin: -5px 0"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <div class="editable-row-operations">
                <span v-if="editableData[record.id]">
                  <a-typography-link @click="save(record.id, item)" class="mr8"
                    >保存</a-typography-link
                  >
                  <a-popconfirm title="是否取消?" @confirm="cancel(record.id)">
                    <a>取消</a>
                  </a-popconfirm>
                </span>
                <span v-if="!editableData[record.id] && !record.children">
                  <a @click="edit(record.id, item)">编辑</a>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </template>
    </template>
  </a-card>
</template>

<style lang="scss">
.json-header {
  height: 230px;
  .json-data {
    height: 230px;
    overflow-y: scroll;
  }
}
</style>
