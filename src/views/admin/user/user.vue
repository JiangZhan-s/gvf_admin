<template>

  <GVFTable
      @delete="userDelete" @edit="userEdit" @user_add="userAdd"
      :columns="data.columns"
      base-file-url="/api/query_user_all"
      :is-share="data.isShare"
      :is-file="data.isFile"
      :is-folder="data.isFolder"
      :is-user="data.isUser"
      :is-role="data.isRole"
      :is-setting="data.isSetting"
      :is-fabric="data.isFabric"
      ref="gvfTable"
  >
  </GVFTable>
</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import {reactive} from "vue";


const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

const data = reactive({
  columns: [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '身份',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
    {
      title: '修改时间 ',
      dataIndex: 'UpdatedAt',
      key: 'UpdatedAt',
    },
    {
      title: '操作 ',
      dataIndex: 'action',
      key: 'action',
    },
  ],
  userList: [],
  isShare: false,
  isFile: false,
  isFolder: false,
  isUser: true,
  isRole: false,
  isSetting: false,
  isFabric: false,

  userVisible: false,
})

function userAdd() {

}

function userEdit(userId) {
  console.log(userId)
}

function userDelete(userId) {

  console.log(userId)
}

</script>

<style scoped>

</style>