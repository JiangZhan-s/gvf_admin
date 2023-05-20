<template>
  <a-tabs v-model:activeKey="activeKey" @tabClick="onClick" centered class="gvf_tab">
    <a-tab-pane key="1">
      <template #tab>
        <span>
          <i class="fa fa-history"></i>
          区块链历史行为
        </span>
      </template>

      <GVFTable
          :columns="data1.columns"
          base-file-url="/api/query_action"
          :is-share="data.isShare"
          :is-file="data.isFile"
          :is-folder="data.isFolder"
          :is-user="data.isUser"
          :is-role="data.isRole"
          :is-setting="data.isSetting"
          :is-fabric="data.isFabric"
      >
      </GVFTable>
    </a-tab-pane>
    <a-tab-pane key="2">
      <template #tab>
        <span>
           <i class="fa fa-credit-card"></i>
          区块链账本
        </span>
      </template>

      <GVFTable
          :columns="data2.columns"
          base-file-url="/api/query_ledger"
          :is-share="data.isShare"
          :is-file="data.isFile"
          :is-folder="data.isFolder"
          :is-user="data.isUser"
          :is-role="data.isRole"
          :is-setting="data.isSetting"
          :is-fabric="data.isFabric"
      >
      </GVFTable>
    </a-tab-pane>
  </a-tabs>

</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import {reactive, ref} from "vue";

const activeKey = ref('1')

const data = reactive({
  isShare: false,
  isFile: false,
  isFolder: false,
  isUser: false,
  isRole: false,
  isSetting: true,
  isFabric: true,
})
const data1 = reactive({
  columns: [
    {
      title: "操作时间",
      dataIndex: 'Timestamp',
      key: 'Timestamp',
    },
    {
      title: '操作用户ID',
      dataIndex: 'UserID',
      key: 'UserID',
    },
    {
      title: '行为',
      dataIndex: 'Action',
      key: 'Action',
    },
    {
      title: '细节',
      dataIndex: 'Details',
      key: 'Details',
    },
  ],
  loginDataList: [],
})
const data2 = reactive({
  columns: [
    {
      title: "键值",
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: '内容',
      dataIndex: 'data',
      key: 'data',
    }
  ],
  loginDataList: [],
})

function onClick(key) {
  activeKey.value = key
}

</script>

<style scoped>
.gvf_tab {
  background-color: var(--card_bg);
}
</style>