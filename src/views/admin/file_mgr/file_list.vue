<template>
  <a-modal title="分享码" v-model:visible="data.isCheck" @ok="shareOk">
    <span>{{ data.shareCode }}</span>
  </a-modal>
  <a-modal title="上传文件" v-model:visible="data.modalVisible" @ok="handleOk" @cancel="handleCancel">
    <a-upload
        v-model:file-list="data.fileList"
        list-type="picture-card"
        :custom-request="function (){}"
    >
      <template #itemRender="{ file, actions }">
        <a-space>
          <div
              :style="'border:1px solid #d9d9d9;width:102.4px;height:102.4px;display:flex;flex-direction:column;justify-content:center;border-radius:2px'">
            <div class="fa fa-file-o" :style="'text-align:center;color:blue;font-size:24px;margin-bottom:8px'"></div>
            <span :style="'color: blue;text-align:center'">{{ file.name }}</span>
          </div>
        </a-space>
      </template>
      <div>
        <i class="ant-icon ant-icon-plus"></i>
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
  </a-modal>
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
  <GVFTable
      @delete="fileDelete" @download="fileDownload" @upload="fileUploadModal" @share="fileShare"
      @folder_add="folderAdd"
      :columns="data.columns"
      base-file-url="/api/query_all"
      :is-share="data.isShare"
      ref="gvfTable"
  >
  </GVFTable>
  <GVFProgress
      :isUploadProgressShow="data.isUploadProgressShow"
      :uploadProgress="data.uploadProgress"
      :uploadFileName="data.uploadFileName"
  ></GVFProgress>
</template>

<script setup>
import {ref} from "vue"
import {useStore} from "@/stores/store";
import GVFTable from "../../../components/admin/gvf_table.vue"
import GVFProgress from "../../../components/progressDialog/ProgressDialog.vue"
import {reactive} from "vue";
import {fileDownloadApi, fileUploadApi, fileBatchUploadApi} from "../../../api/file_api";
import {folderAddApi} from "../../../api/folder_api"
import {saveAs} from "file-saver"
import {message} from "ant-design-vue";
import {shareGenerateApi} from "../../../api/share_api";

function test(...params) {
  params[0].onSuccess()
  console.log(params)
}

const store = useStore()

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
  isCheck: false,
  folderVisible: false,
  folderName: "",
})
const gvfTable = ref(null)

async function handleFinish() {
  data.folderVisible = false
  let res = await folderAddApi(JSON.parse(localStorage.getItem('folderRootId')), data.folderName)
  if (res.code) {
    message.error("出错了！")
    return
  }
  message.success(res.msg)
}

async function fileShare(fileId) {
  console.log(fileId)
  let res = await shareGenerateApi("", fileId)
  if (res.code) {
    message.error(res.msg)
    return
  }
  message.success(res.data)
  data.isCheck = true
  data.shareCode = res.data
}

function shareOk() {
  data.isCheck = false
}

async function handleBatchUpload() {
  try {
    const formData = new FormData();
    const promises = [];
    for (let i = 0; i < data.fileList.length; i++) {
      let file = data.fileList[i].originFileObj
      let reader = new FileReader(); // 创建FileReader对象
      reader.readAsArrayBuffer(file);
      const promise = new Promise((resolve) => {
        // 读取文件完成后执行回调函数
        reader.onload = function () {
          const arrayBuffer = reader.result; // 获取二进制数据
          // 将二进制数据上传到服务器
          // 创建包含二进制数据的Blob对象
          const blob = new Blob([arrayBuffer], {type: file.type});
          formData.append('file', blob, file.name);
          data.uploadFileName = data.fileList.map((file) => file.name).join(", ");
          resolve();
        };
      });
      promises.push(promise)
    }
    await Promise.all(promises)
    let res = await fileBatchUploadApi(formData, JSON.parse(localStorage.getItem('folderRootId')), {
      onUploadProgress: (progressEvent) => {
        data.uploadProgress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });
    const jsonStrings = res.split("}{"); // 按照"}{"分隔拆分
    const results = jsonStrings.map((jsonString, index) => {
      if (index !== 0) {
        jsonString = "{" + jsonString;
      }
      if (index !== jsonStrings.length - 1) {
        jsonString = jsonString + "}";
      }
      return JSON.parse(jsonString);
    });

    // 处理拆分后的 JSON 对象数组
    message.success(res.msg)
    data.fileList = []
    data.uploadProgress = 0;
    data.uploadFileName = "";
    data.isUploadProgressShow = false;
    gvfTable.value.refresh()
  } catch (error) {
    message.error(error.message || '上传失败')
  }
}

async function handleOk() {
  data.isOkClicked = true
  data.isUploadProgressShow = true
  if (data.fileList.length === 1) {
    data.uploadProgress = 0;
    await uploadFile(data.fileList[0].originFileObj);
  }
  if (data.fileList.length > 1) {
    await handleBatchUpload()
  }
  data.isOkClicked = false
  data.modalVisible = false
}

function handleCancel() {
  data.fileList = []
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
        gvfTable.value.refresh()
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

function folderAdd() {
  data.folderVisible = true;
}

</script>

<style lang="scss">

</style>