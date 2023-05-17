<template>
  <div class="gvf_container">
    <div class="gvf_search">
      <a-input-search
          placeholder="搜索文件名称"
          style="width: 200px"
      />
      <div class="gvf_refresh">
        <a-button title="刷新本页" @click="refresh"><i class="fa fa-refresh"></i></a-button>
      </div>
    </div>
    <div class="gvf_actions">
      <slot name="upload">
        <a-button type="primary" @click="uploadModal" v-if="!props.isShare">上传</a-button>
      </slot>
      <slot name="batchDownload">
        <a-button type="primary" @click="downloadBatch" v-if="!props.isShare">批量下载</a-button>
      </slot>
      <slot name="batchRemove">
        <a-button type="danger" v-if="data.selectedRowKeys.length" @click="removeBatch">批量删除</a-button>
      </slot>
      <slot name="folderAdd">
        <a-button type="primary" @click="folderAddModal" v-if="!props.isShare">新建文件夹</a-button>
      </slot>

    </div>
    <div class="gvf_tables">
      <a-spin :spinning=data.spinning tip="加载中..." :delay="300">
        <a-table
            :columns="props.columns"
            :row-selection="{
            selectedRowKeys: data.selectedRowKeys,
             onChange: onSelectChange
          }"
            :pagination="false"
            :row-key="'ID'"
            :data-source="data.list">
          <template #bodyCell="{column,record}">
            <template v-if="column.key==='file_name'"></template>
            <template v-if="column.key==='upload_time'">
              <span>{{ getFormatDate(record.upload_time) }}</span>
            </template>
            <template v-if="column.key==='action'">
              <slot name="code" v-bind="{column,record}" v-if="props.isShare">
                <a-button class="gvf_table_action code" @click="checkShareCode(record.ID)" type="primary">查看分享码
                </a-button>
              </slot>
              <slot name="download" v-bind="{column,record}" v-if="!props.isShare">
                <a-button class="gvf_table_action download" @click="downloadFile(record.ID)" type="primary">下载
                </a-button>
              </slot>
              <slot name="share" v-bind="{column,record}" v-if="!props.isShare">
                <a-button class="gvf_table_action share" @click="shareFile(record.ID)" type="primary">分享</a-button>
              </slot>
              <a-popconfirm
                  title="是否确定删除？"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="fileRemove(record.ID)"
                  v-if="!props.isShare"
              >
                <a-button class="gvf_table_action delete" type="danger">删除</a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </a-spin>
    </div>
    <div class="gvf_pages">
      <a-pagination
          :showSizeChanger="false"
          v-model:current="page.page"
          v-model:page-size="page.limit"
          @change="pageChange"
          :total=data.count
          :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import {useStore} from "@/stores/store";
import {getFormatDate} from "../../utils/date";
import {message} from "ant-design-vue";
import {baseListApi} from "../../api/base_api";

const store = useStore()

const props = defineProps({
  columns: {
    type: Array
  },
  baseFileUrl: {
    type: String,
  },
  baseFolderUrl: {
    type: String,
  },
  isShare: {
    type: Boolean,
  }
})
const emits = defineEmits(["delete", "download", "upload", "share", "code", "folder_add"])
const page = reactive({
  page: 1,
  limit: 5,
})
const data = reactive({
  list: [],
  selectedRowKeys: [],
  count: 0,
  spinning: true,//默认在加载中
})
const typeMap = {
  1: '文档',
  2: '图片',
  3: '音乐',
  4: '视频',
  5: '其他',
}


function onSelectChange(selectedKeys) {
  data.selectedRowKeys = selectedKeys
}

function checkShareCode(file_id) {
  emits("code", [file_id])
}

function shareFile(file_id) {
  emits("share", [file_id])
}

function uploadModal() {
  emits("upload")
}

function folderAddModal() {
  emits("folder_add")
}

function downloadFile(file_id) {
  emits("download", [file_id])
}

function downloadBatch() {
  emits("download", data.selectedRowKeys)
}

//删除单个文件
function fileRemove(file_id) {
  emits("delete", [file_id])
}

function removeBatch() {
  emits("delete", data.selectedRowKeys)
}

async function getData() {
  let res = await baseListApi(props.baseFileUrl, page, {
    'Content-Type': 'application/json', // 设置请求数据格式
    'parent_folder_id': JSON.parse(localStorage.getItem('folderRootId')),
  })
  console.log(res)
  if (res.code) {
    message.error(res.msg)
    return
  }
  data.list = res.data.list.map(item => ({
    ...item,
    type: typeMap[item.Type]
  }))
  data.count = res.data.count
  data.spinning = false
}

function refresh() {
  //全部刷新
  //location.reload()
  //部分刷新
  message.success("刷新成功")
  getData()
}

function pageChange(page, limit) {
  getData()
}

getData()

defineExpose({
  refresh,
})

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

  .gvf_table_action.share {
    margin-right: 10px;
  }

  .gvf_table_action.code {
    margin-right: 10px;
  }
}
</style>