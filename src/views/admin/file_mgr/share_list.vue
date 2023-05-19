<template>
  <a-modal title="分享码" v-model:visible="data.isCheck" @ok="shareOk">
    <span>
      查询码: {{ data.shareHash }}
      <br/>
      提取码: {{ data.shareCode }}
    </span>
  </a-modal>
  <GVFTable @code="codeCheck"
            :columns="data.columns"
            base-file-url="/api/query_share_all"
            :is-share="data.isShare"
            :is-folder="data.isFolder"
            :is-file="data.isFile"
            :is-user="data.isUser"
            :is-role="data.isRole"
  >
  </GVFTable>
</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import {reactive} from "vue";
import {queryShareCodeByIdApi, getCodeByIdApi} from "../../../api/share_api";
import {message} from "ant-design-vue";

const data = reactive({
  columns: [
    {
      title: '名称',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '后缀',
      dataIndex: 'postfix',
      key: 'postfix',
    },
    {
      title: '大小',
      dataIndex: 'size_str',
      key: 'size_str',
    },
    {
      title: '下载次数',
      dataIndex: 'download_num',
      key: 'download_num',
    },
    {
      title: '上传时间 ',
      dataIndex: 'upload_time',
      key: 'upload_time',
    },
    {
      title: '操作 ',
      dataIndex: 'action',
      key: 'action',
    },
  ],
  modalVisible: false,
  downloadTipVisible: false,
  isOkClicked: false,
  fileList: [],
  uploadProgress: 0,
  isUploadProgressShow: false,
  uploadFileName: "",

  isShare: true,
  isFile: false,
  isFolder: false,
  isUser: false,
  isRole: false,

  shareHash: "",
  shareCode: "",
  isCheck: false,
})

function shareOk() {
  data.isCheck = false
}

async function codeCheck(fileId) {

  let res = await queryShareCodeByIdApi(fileId)
  if (res.code) {
    message.error("请重试")
  }
  data.shareHash = res.data
  res = await getCodeByIdApi(fileId)
  console.log(res)
  data.shareCode = res.data
  data.isCheck = true

}

</script>

<style>

</style>