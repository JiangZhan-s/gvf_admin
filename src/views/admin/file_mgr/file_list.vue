<template>
  <a-modal title="分享码" v-model:visible="data.isShare" @ok="shareOk">
    <span>{{ data.shareCode }}</span>
  </a-modal>
  <a-modal title="上传文件" v-model:visible="data.modalVisible" @ok="handleOk">
    <a-upload
        v-model:file-list="data.fileList"
        :custom-request="()=>{}"
        list-type="picture-card"
    >
      <div v-if="data.fileList.length === 0">
        <i class="ant-icon ant-icon-plus"></i>
        <div class="ant-upload-text">上传</div>
      </div>
      <div v-else>

      </div>
    </a-upload>
  </a-modal>
  <GVFTable @delete="fileDelete" @download="fileDownload" @upload="fileUploadModal" @share="fileShare"
            :columns="data.columns"
            base-url="/api/query_all"
  >
  </GVFTable>
  <GVFProgress
      :isUploadProgressShow="data.isUploadProgressShow"
      :uploadProgress="data.uploadProgress"
      :uploadFileName="data.uploadFileName"
  ></GVFProgress>
</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import GVFProgress from "../../../components/progressDialog/ProgressDialog.vue"
import {reactive} from "vue";
import {fileDownloadApi, fileUploadApi} from "../../../api/file_api";
import {saveAs} from "file-saver"
import {message} from "ant-design-vue";
import {shareGenerateApi} from "../../../api/share_api";

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
  isShare: false,
  shareCode: "",
})

async function fileShare(fileId) {
  console.log(fileId)
  let res = await shareGenerateApi("", fileId)
  if (res.code) {
    message.error(res.msg)
    return
  }
  message.success(res.data)
  data.isShare = true
  data.shareCode = res.data
}

function shareOk() {
  data.isShare = false
}

async function handleOk() {
  data.isOkClicked = true
  data.isUploadProgressShow = true
  if (data.fileList.length > 0) {
    data.uploadProgress = 0;
    await uploadFile(data.fileList[0].originFileObj);
  }
  data.isOkClicked = false
  data.modalVisible = false
}

async function uploadFile(file) {
  try {
    let reader = new FileReader(); // 创建FileReader对象
    // 读取文件完成后执行回调函数
    reader.onload = async function () {
      const arrayBuffer = reader.result; // 获取二进制数据
      // 将二进制数据上传到服务器
      const formData = new FormData();
      // 创建包含二进制数据的Blob对象
      const blob = new Blob([arrayBuffer], {type: file.type});
      formData.append('file', blob, file.name);
      data.uploadFileName = file.name
      let res = await fileUploadApi(formData, JSON.parse(localStorage.getItem('folderRootId')), {
        onUploadProgress: (progressEvent) => {
          data.uploadProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      });
      console.log(res)
      if (res.code === 0) {
        message.success(res.msg)
        data.fileList = []
        data.uploadProgress = 0;
        data.uploadFileName = "";
        data.isUploadProgressShow = false;
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    message.error(error.message || '上传失败')
  }
}

//展开上传文件的窗口
function fileUploadModal() {
  data.modalVisible = true
  data.isOkClicked = false
}

async function fileDownload(fileIdList) {
  let res = await fileDownloadApi(fileIdList);
  try {
    let contentDisposition = res.headers['content-disposition']; // 获取响应头部中的Content-Disposition字段
    let fileName = null;
    let matches = contentDisposition.match(/filename\*?=(UTF-8''|")(.*?)\1/); // 从Content-Disposition中提取编码后的文件名
    if (matches && matches.length > 2) {
      fileName = decodeURIComponent(matches[2]); // 解码文件名
    } else {
      matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/); // 从Content-Disposition中提取未编码的文件名
      if (matches && matches.length > 1) {
        fileName = decodeURIComponent(matches[1].replace(/^.*?''/, '')); // 处理文件名
      }
    }
    const fileData = new Blob([res.data], {type: 'application/octet-stream'}); // 创建 Blob 对象
    saveAs(fileData, fileName); // 使用 saveAs 方法保存文件数据
    console.log(res)
  } catch (error) {
    console.log(error)
    message.error("数据可能被篡改，拒绝下载请求")
  }

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