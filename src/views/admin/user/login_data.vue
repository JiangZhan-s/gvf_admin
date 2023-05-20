<template>
  <GVFTable
      :columns="data.columns"
      base-file-url="/api/query_login_data_all"
      :is-share="data.isShare"
      :is-file="data.isFile"
      :is-folder="data.isFolder"
      :is-user="data.isUser"
      :is-role="data.isRole"
      :is-login-data="data.isLoginData"
      ref="gvfTable"
  >
  </GVFTable>
</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import {reactive} from "vue";

const data = reactive({
  columns: [
    {
      title: "昵称",
      dataIndex: 'nick_name',
      key: 'nick_name',
    },
    {
      title: '登陆时间',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '登陆地址',
      dataIndex: 'addr',
      key: 'addr',
    },
    {
      title: '登陆设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '令牌 ',
      dataIndex: 'token',
      key: 'token',
    },
  ],
  loginDataList: [],
  isShare: false,
  isFile: false,
  isFolder: false,
  isUser: false,
  isRole: false,
  isLoginData: true,

})


</script>

<style scoped>

</style>