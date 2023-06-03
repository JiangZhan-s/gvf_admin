<template>
  <div class="gvf_container">
    <div class="gvf_search">
      <a-input-search
          placeholder="搜索名称"
          style="width: 200px"
      />
      <div class="gvf_refresh">
        <a-button title="刷新本页" @click="refresh"><i class="fa fa-refresh"></i></a-button>
      </div>
    </div>
    <div class="gvf_actions">
      <slot name="userAdd">
        <a-button type="primary" @click="userAddModal" v-if="props.isUser||props.isRole">添加</a-button>
      </slot>
      <slot name="upload">
        <a-button type="primary" @click="uploadModal" v-if="props.isFile">上传</a-button>
      </slot>
      <slot name="batchDownload">
        <a-button type="primary" @click="downloadBatch" v-if="props.isFile">批量下载</a-button>
      </slot>
      <slot name="batchRemove">
        <a-button type="danger" v-if="data.selectedRowKeys.length" @click="removeBatch">批量删除</a-button>
      </slot>
      <slot name="folderAdd">
        <a-button type="primary" @click="folderAddModal" v-if="props.isFile">新建文件夹</a-button>
      </slot>

    </div>
    <div class="gvf_tables">
      <a-spin :spinning=data.spinning tip="加载中..." :delay="300" :scroll="{ x: 0, y: 300 }">
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
            <template v-if="column.key==='CreatedAt'">
              <span>{{ getFormatDate(record.CreatedAt) }}</span>
            </template>
            <template v-if="column.key==='Timestamp'">
              <span>{{ getFormatDate(record.Timestamp) }}</span>
            </template>
            <template v-if="column.key==='UpdatedAt'">
              <span>{{ getFormatDate(record.UpdatedAt) }}</span>
            </template>
            <template v-if="column.key==='token'">
              <span style="width: 400px; display: inline-block">{{ record.token }}</span>
            </template>
            <template v-if="column.key==='dataType'">
              <a-tag color="orange" v-if="record.dataType==='Data'">{{ record.dataType }}</a-tag>
              <a-tag color="purple" v-if="record.dataType==='Share'">{{ record.dataType }}</a-tag>
            </template>
            <template v-if="column.key==='action'">
              <slot name="code" v-bind="{column,record}" v-if="props.isShare">
                <a-button class="gvf_table_action code" @click="checkShareCode(record.ID)" type="primary">查看分享码
                </a-button>
              </slot>
              <slot name="download" v-bind="{column,record}" v-if="props.isFile||(props.isFolder&&record.is_file)">
                <a-button class="gvf_table_action download" @click="downloadFile(record.ID)" type="primary">下载
                </a-button>
              </slot>
              <slot name="share" v-bind="{column,record}" v-if="props.isFile||(props.isFolder&&record.is_file)">
                <a-button class="gvf_table_action share" @click="shareFile(record.ID)" type="primary">分享</a-button>
              </slot>
              <slot name="edit" v-bind="{column,record}" v-if="props.isUser||props.isRole">
                <a-button class="gvf_table_action share" @click="edit(record.ID)" type="primary">修改</a-button>
              </slot>
              <a-popconfirm
                  title="是否确定删除？"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="remove(record.ID)"
                  v-if="props.isFile||props.isUser||props.isRole"
              >
                <a-button class="gvf_table_action delete" type="danger">删除</a-button>
              </a-popconfirm>
              <a-popconfirm
                  title="是否确定删除？"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="removeFolder(record.ID,record.is_file)"
                  v-if="props.isFolder"
              >
                <a-button class="gvf_table_action delete" type="danger">删除</a-button>
              </a-popconfirm>
            </template>
            <template v-if="column.key==='Action'">
              <a-tag color="red" v-if="record.Action==='创建分享'">{{ record.Action }}</a-tag>
              <a-tag color="blue" v-else-if="record.Action==='上传文件'">{{ record.Action }}</a-tag>
            </template>
            <template v-if="column.key==='name'&&!record.is_file">
              <i class="fa fa-folder-o" style="margin-right: 10px;color: blue"></i>
              <a href="javascript:void(0)" @click="changeFolder(record.ID)" style="font-weight: 800">{{
                  record.name
                }}</a>
            </template>
            <template v-if="column.key==='name'&&record.is_file">
              <i class="fa fa-file-o" style="margin-right: 10px;color: green"></i>
              <span style="font-weight: 500">{{ record.name }}</span>
            </template>
            <template v-if="column.key==='update_time'">
              <span>{{ getFormatDate(record.update_time) }}</span>
            </template>
          </template>
        </a-table>
      </a-spin>
    </div>
    <div class="gvf_pages">
      <a-pagination v-if="(props.isFile||props.isShare||props.isSetting)&&!props.isFabric"
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
import {fileWithFolderApi} from "../../api/file_api"

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
  },
  isFile: {
    type: Boolean,
  },
  isFolder: {
    type: Boolean,
  },
  isUser: {
    type: Boolean,
  },
  isRole: {
    type: Boolean,
  },
  isSetting: {
    type: Boolean,
  },
  isFabric: {
    type: Boolean,
  }
})
const emits = defineEmits(["delete", "download", "upload", "share",
  "code", "folder_add", "user_add", "edit", "folder_change", "delete_folder"])
const page = reactive({
  page: 1,
  limit: 7,
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

function changeFolder(folderId) {
  emits("folder_change", [folderId])
}

function edit(id) {
  emits("edit", [id])
}

function userAddModal() {
  emits("user_add")
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

//删除单个
function remove(id) {
  emits("delete", [id])
}

//删除单个
function removeFolder(id, isFile) {
  emits("delete_folder", [id, isFile])
}


function removeBatch() {
  emits("delete", data.selectedRowKeys)
}

async function getData() {
  if (props.isFabric) {
    let res = await baseListApi(props.baseFileUrl, page, {
      'Content-Type': 'application/json', // 设置请求数据格式
    })
    console.log(res)
    if (res.code) {
      message.error(res.msg)
      return
    }
    data.list = res.data.map(item => ({
      ...item,
      data: JSON.stringify(item.data)
    }))
  } else if (props.isFolder) {
    let res = await fileWithFolderApi(JSON.parse(localStorage.getItem('folderRootId')))
    console.log(res)
    if (res.code) {
      message.error(res.msg)
      return
    }
    data.list = res.data
  } else {
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
  }
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
    min-height: 536px;
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