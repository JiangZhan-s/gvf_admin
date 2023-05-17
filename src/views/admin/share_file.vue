<template>
  <a-modal title="提取码验证"
           v-model:visible="data.modalVisible"
           @ok="checkShareCode"
           ok-text="确认"
           cancel-text="取消"
  >
    <div class="verify">
      <a-input
          v-model:value="data.shareCode"
          placeholder="请输入文件提取码"
          style="width: calc(100% - 200px);"/>
    </div>
  </a-modal>
  <div class="gvf_share_container">
    <div class="gvf_share_search">
      <a-input-search
          placeholder="请输入文件查询码"
          style="width: 500px"
          enter-button="查找"
          @search="onSearch"
      />
    </div>
    <div class="gvf_share_description">
      <a-descriptions title="文件信息" bordered>
        <a-descriptions-item label="名称">{{ data.fileInfo.file_name }}</a-descriptions-item>
        <a-descriptions-item label="类型">{{ data.fileInfo.postfix }}</a-descriptions-item>
        <a-descriptions-item label="大小">{{ data.fileInfo.size_str }}</a-descriptions-item>
        <a-descriptions-item label="上传时间">{{ data.fileInfo.upload_time }}</a-descriptions-item>
        <a-descriptions-item label="分享时间" :span="2">{{ data.shareInfo.CreatedAt }}</a-descriptions-item>
        <a-descriptions-item label="状态" :span="3">
          <a-badge :status="data.fileInfo.status" :text="data.fileInfo.statusText"/>
        </a-descriptions-item>
        <a-descriptions-item label="归属用户">{{ data.owner }}</a-descriptions-item>
        <a-descriptions-item label="下载次数" :span="2">{{ data.fileInfo.download_num }}</a-descriptions-item>
        <a-descriptions-item label="分享描述">{{ data.fileInfo.description }}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="gvf_share_button" @click="downloadShareFile">
      <a-button type="primary" size="large">
        <template #icon>
          <div class="fa fa-cloud-download" style="margin-right: 10px"></div>
        </template>
        下载文件
      </a-button>
    </div>
  </div>
</template>

<script setup>

import {getFormatDate} from "../../utils/date"
import {getNicknameById} from "../../api/user_api"
import {getShareInfoByHashApi, getShareFileInfoByCodeApi} from "../../api/share_api"
import {message} from "ant-design-vue";
import {reactive} from "vue";
import {saveAs} from "file-saver"
import {fileDownloadApi} from "../../api/file_api";

const typeMap = {
  1: '文档',
  2: '图片',
  3: '音乐',
  4: '视频',
  5: '其他',
}
const data = reactive({
  fileInfo: {
    file_name: "**",
    postfix: "**",
    size_str: "**",
    upload_time: "**",
    shareTime: "**",
    status: "**",
    statusText: "******",
    download_num: 0,
    description: "************",
  },
  shareInfo: {
    CreatedAt: "",
    file_id: "",
    user_id: ""
  },
  owner: "**",
  modalVisible: false,
  shareCode: "",
})

async function onSearch(hashValue) {
  let res = await getShareInfoByHashApi(hashValue)
  if (res.code) {
    data.shareInfo.file_id = 0
    message.error(res.msg)
    return
  }
  data.shareInfo = res.data
  data.shareInfo.CreatedAt = getFormatDate(data.shareInfo.CreatedAt)
  console.log(data.shareInfo)
  data.modalVisible = true
}

async function checkShareCode() {
  let res = await getShareFileInfoByCodeApi(data.shareCode, data.shareInfo.file_id)
  if (res.code) {
    data.shareInfo.file_id = 0
    data.shareCode = ""
    data.modalVisible = false
    message.error(res.msg)
    return
  }
  data.modalVisible = false
  data.fileInfo = res.data
  res = await getNicknameById(data.shareInfo.user_id)
  data.owner = res.data
}

async function downloadShareFile() {
  console.log(data.shareInfo.file_id)
  let res = await fileDownloadApi(data.shareInfo.file_id);
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
    await checkShareCode()
    console.log(res)
  } catch (error) {
    console.log(error)
    message.error("数据可能被篡改，拒绝下载请求")
  }
}

</script>

<style lang="scss">
.verify {
  display: flex;
  flex-direction: column;
}

.gvf_share_container {
  background-color: var(--card_bg);
  height: 100%;

  .gvf_share_search {
    padding: 10px;
    border-bottom: 1px solid var(--bg);
    display: flex;
    justify-content: center;
  }

  .gvf_share_description {
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

  .gvf_share_button {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 15px;
  }

}
</style>