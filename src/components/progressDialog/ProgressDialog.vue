<template>
  <div
      class="progressContainer"
      :class="props.isUploadProgressShow ? 'showProgressContainer' : ''"
  >
    <div class="title">上传进度:</div>
    <span>{{ props.uploadFileName }}</span>
    <!-- 上传进度条 -->
    <a-progress
        :percent="props.uploadProgress"
        status="active"
        size="small"
        class="uploadProgress"
    ></a-progress>
    <div class="tips">tips: 上传过程中,请不要离开该页面哦!</div>
  </div>
</template>

<script setup>

const props = defineProps({
  uploadFileName: {
    type: String,
  },
  isUploadProgressShow: {
    type: Boolean,
  },
  uploadProgress: {
    type: Number,
  }
})


</script>

<style scoped>
.progressContainer {
  position: fixed;
  width: 330px;
  padding: 10px 5px 10px 20px;
  right: -330px;
  bottom: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.5s ease;
  border-radius: 5px;
  border: 1px solid #eee;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  background-color: #fff;
}

.progressContainer .progressItem {
  display: flex;
  align-items: center;
  margin: 0 0 10px 5px;
  color: rgb(82, 82, 82);
}

.progressContainer div span {
  font-size: 13px;
  width: 110px;
  overflow: hidden;
  margin-right: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title {
  font-size: 14px;
  margin: 0 0 10px -5px;
}

.progressContainer .el-progress {
  flex: 1;
}

.progressContainer .tips {
  color: rgb(177, 177, 177);
  font-size: 12px;
}

.showProgressContainer {
  right: 30px;
}
</style>
