<template>
  <GVFTable @delete="fileDelete" @download="fileDownload"
            :columns="data.columns"
            base-url="/api/query_all"
  >
    <template #upload>
      <a-button type="primary">上传</a-button>
    </template>
  </GVFTable>
</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import {reactive} from "vue";

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
})

function fileDownload(fileIdList) {
  console.log(fileIdList)
}

function fileDelete(fileIdList) {
  console.log(fileIdList)
}

</script>

<style lang="scss">
.gvf_container {
  background-color: var(--card_bg);
  height: 100%;

  .gvf_search {
    padding: 10px;
    border-bottom: 1px solid var(--bg);
    position: relative;

    .gvf_refresh {
      position: absolute;
      right: 10px;
      top: 10px;

      .i {
        color: var(--text);
      }
    }
  }

  .gvf_actions {
    padding: 10px;

    .ant-btn {
      margin-right: 10px;
    }
  }

  .gvf_tables {
    padding: 10px;
  }

  .gvf_pages {
    display: flex;
    justify-content: center;
    padding: 10px;
    margin-bottom: 10px;
  }

  .gvf_table_action.download {
    margin-right: 10px;
  }
}
</style>