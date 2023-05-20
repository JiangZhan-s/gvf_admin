<template>
  <a-modal title="新建文件夹" v-model:visible="data.folderVisible" :footer="null">
    <a-form
        layout="inline"
        :model="data"
        @finish="handleFinish"
    >
      <a-form-item>
        <a-input v-model:value="data.folderName" placeholder="文件夹名称" style="margin-left:20px;margin-right: 100px">
          <template #prefix>
            <div class="fa fa-folder-o"></div>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item style="margin-left:50px ">
        <a-button
            type="primary"
            html-type="submit"
            :disabled="data.folderName === '' "
        >
          确认
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <div class="gvf_container">
    <div class="gvf_actions">
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="">
              上传文件
            </a-menu-item>
            <a-menu-item key="2" @click="">
              上传文件夹
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary">
          <i class="fa fa-upload " style="margin-right: 10px"></i>
          上传
        </a-button>
      </a-dropdown>
      <a-button style="margin-left: 10px" @click="folderAdd">
        <a-icon type="folder-add"/>
        新建文件夹
      </a-button>
      <a-button style="margin-left: 10px" @click="backFolder">
        <a-icon type="folder-add"/>
        返回上一级
      </a-button>

    </div>

    <GVFTable @folder_change="changeFolder"
              :columns="data.columns"
              base-file-url="/api/query_file_with_folder"
              :is-share="data.isShare"
              :is-file="data.isFile"
              :is-folder="data.isFolder"
              :is-user="data.isUser"
              :is-role="data.isRole"
              :is-setting="data.isSetting"
              :is-fabric="data.isFabric"
              ref="gvf_table"
    >
    </GVFTable>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import GVFTable from "../../../components/admin/gvf_table.vue"
import {folderAddApi, parentIdFindApi} from "../../../api/folder_api";
import {message} from "ant-design-vue";

const gvf_table = ref(null)

const data = reactive({
  columns: [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      key: 'update_time',
    },
    {
      title: '大小',
      dataIndex: 'size_str',
      key: 'size_str',
    },
    {
      title: '操作 ',
      dataIndex: 'action',
      key: 'action',
    },
  ],
  list: [],

  isShare: false,
  isFile: false,
  isFolder: true,
  isUser: false,
  isRole: false,
  isSetting: false,
  isFabric: false,

  folderVisible: false,
  folderName: "",
});

const folderInfo = reactive({
  folderName: "",
  parentFolderId: 0,
})

function folderAdd() {
  data.folderVisible = true;
}


async function handleFinish() {
  data.folderVisible = false
  folderInfo.folderName = data.folderName
  folderInfo.parentFolderId = JSON.parse(localStorage.getItem('folderRootId'))
  let res = await folderAddApi(folderInfo)
  if (res.code) {
    message.error("出错了！")
    return
  }
  message.success(res.msg)
  data.folderName = ""
  gvf_table.value.refresh()
}

function changeFolder(folder_id) {
  localStorage.setItem("folderRootId", folder_id[0])
  gvf_table.value.refresh()
  console.log(folder_id[0])
}

async function backFolder() {
  let res = await parentIdFindApi(JSON.parse(localStorage.getItem('folderRootId')))
  if (res.code) {0
    message.warn(res.msg)
    return
  }
  console.log(res.data)
  localStorage.setItem("folderRootId", res.data)
  message.success("返回成功")
  gvf_table.value.refresh()
}

</script>

<style lang="scss">

</style>
