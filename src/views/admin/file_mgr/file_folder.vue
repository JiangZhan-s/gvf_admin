<template>

  <div class="gvf_container">

    <div class="gvf_actions">
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="">
              上传文件
            </a-menu-item>
            <a-menu-item key="2" @click="handleMenuClick">
              上传文件夹
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary">
          <i class="fa fa-upload " style="margin-right: 10px"></i>
          上传
        </a-button>
      </a-dropdown>
      <a-button style="margin-left: 10px">
        <a-icon type="folder-add"/>
        新建文件夹
      </a-button>
    </div>

    <GVFTable :columns="data.columns"
              base-file-url="/api/query_file_folder"
              :is-share="data.isShare"
              :is-file="data.isFile"
              :is-folder="data.isFolder"
              :is-user="data.isUser"
              :is-role="data.isRole"
    >
    </GVFTable>
    <div>
      <!--    <a-table-->
      <!--        :columns="data.columns"-->
      <!--        :scroll="{ y: 240 }"-->
      <!--        :data-source="data.list"-->
      <!--        rowKey="id"-->
      <!--        :pagination="false"-->
      <!--    >-->
      <!--      <template #bodyCell="{ column, record }">-->
      <!--        <template v-if="column.key === 'name'">-->
      <!--        <span>-->
      <!--          <i :class="'fa fa-'+record.type"></i>-->
      <!--          {{ record.name }}-->
      <!--        </span>-->
      <!--        </template>-->

      <!--        <template v-else-if="column.key==='action'">-->
      <!--          <slot name="code" v-bind="{column,record}" v-if="props.isShare">-->
      <!--            <a-button class="gvf_table_action code" @click="checkShareCode(record.ID)" type="primary">查看分享码-->
      <!--            </a-button>-->
      <!--          </slot>-->
      <!--          <slot name="download" v-bind="{column,record}" v-if="!props.isShare">-->
      <!--            <a-button class="gvf_table_action download" @click="downloadFile(record.ID)" type="primary">下载-->
      <!--            </a-button>-->
      <!--          </slot>-->
      <!--          <slot name="share" v-bind="{column,record}" v-if="!props.isShare">-->
      <!--            <a-button class="gvf_table_action share" @click="shareFile(record.ID)" type="primary">分享</a-button>-->
      <!--          </slot>-->
      <!--          <a-popconfirm-->
      <!--              title="是否确定删除？"-->
      <!--              ok-text="删除"-->
      <!--              cancel-text="取消"-->
      <!--              @confirm="fileRemove(record.ID)"-->
      <!--              v-if="!props.isShare"-->
      <!--          >-->
      <!--            <a-button class="gvf_table_action delete" type="danger">删除</a-button>-->
      <!--          </a-popconfirm>-->
      <!--        </template>-->
      <!--      </template>-->
      <!--    </a-table>-->
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import GVFTable from "../../../components/admin/gvf_table.vue"

const data = reactive({
  columns: [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '修改时间',
      dataIndex: 'edit_time',
      key: 'edit_time',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '操作 ',
      dataIndex: 'action',
      key: 'action',
    },
  ],
  list: [
    {
      type: "file-o",
      name: "123",
      edit_time: "2020",
      size: "20k"
    },
    {
      type: "folder-o",
      name: "123",
      edit_time: "2020",
      size: "-"
    },
  ],

  isShare: false,
  isFile: false,
  isFolder: true,
  isUser: false,
  isRole: false,

});

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
