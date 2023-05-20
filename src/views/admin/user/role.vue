<template>
  <a-modal title="新建角色" v-model:visible="data.roleVisible" :footer="null" @cancel="clearRole">
    <a-form
        :model="data.role"
        v-bind="layout"
        name="nest-messages"
        :validate-messages="validateMessages"
        @finish="onFinish"
    >
      <a-form-item label="角色名" :rules="[{ required: true }]">
        <a-input v-model:value="data.role.role_name"/>
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea v-model:value="data.role.description"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 10 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal title="编辑角色" v-model:visible="data.roleEditVisible" :footer="null" @cancel="clearRole">
    <div>
      <a-checkbox
          v-model:checked="checkAll"
          :indeterminate="indeterminate"
          @change="onCheckAllChange"
      >
        Check all
      </a-checkbox>
      <a-button type="primary" @click="onConfirm" style="position: absolute;right: 100px">确定</a-button>
    </div>
    <a-divider/>
    <a-checkbox-group v-model:value="checkedList">
      <a-checkbox v-for="permission in data.permission" :key="permission.ID" :value="permission.ID">
        {{ permission.permission_name }}
      </a-checkbox>
    </a-checkbox-group>

  </a-modal>
  <GVFTable
      @delete="roleDelete" @edit="roleEdit" @user_add="roleAdd"
      :columns="data.columns"
      base-file-url="/api/query_role_all"
      :is-share="data.isShare"
      :is-file="data.isFile"
      :is-folder="data.isFolder"
      :is-user="data.isUser"
      :is-role="data.isRole"
      :is-setting="data.isSetting"
      :is-fabric="data.isFabric"
      ref="gvfTable"
  >
  </GVFTable>

</template>

<script setup>
import GVFTable from "../../../components/admin/gvf_table.vue"
import {
  addRoleApi,
  deleteRoleByIdApi,
  fetchRolePermissionIDsApi,
  queryPermissionAllApi,
  updateRolePermission
} from "../../../api/role_api"
import {reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";

const indeterminate = ref(true);
const checkAll = ref(false);
const checkedList = ref([]);

const gvfTable = ref(null)

const layout = {
  labelCol: {span: 5},
  wrapperCol: {span: 16},
};

const data = reactive({
  columns: [
    {
      title: '角色名',
      dataIndex: 'role_name',
      key: 'username',
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
    {
      title: '修改时间 ',
      dataIndex: 'UpdatedAt',
      key: 'UpdatedAt',
    },
    {
      title: '描述 ',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作 ',
      dataIndex: 'action',
      key: 'action',
    },
  ],
  roleList: [],
  isShare: false,
  isFile: false,
  isFolder: false,
  isUser: false,
  isRole: true,
  isSetting: false,
  isFabric: false,

  role: {
    role_name: "",
    description: ""
  },

  permission: [],

  roleVisible: false,
  roleEditVisible: false,

  roleId: 0,

})

const validateMessages = {
  required: '${label} 为必填项!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const onCheckAllChange = (e) => {
  checkedList.value = e.target.checked ? data.permission.map(p => p.ID) : [];
  indeterminate.value = false;
};

watch(checkedList, (val) => {
  indeterminate.value = !!val.length && val.length < data.permission.length;
  checkAll.value = val.length === data.permission.length;
});

//更新映射
async function onConfirm() {
  data.roleEditVisible = false
  let postData = {
    roleId: data.roleId,
    permissionIds: checkedList.value,
  }
  let res = await updateRolePermission(postData)
  if (res.code) {
    message.error(res.msg)
    return
  }
  message.success(res.msg)
}

function roleAdd() {
  data.roleVisible = true
}

async function onFinish() {
  try {
    data.roleVisible = false
    let res = await addRoleApi(data.role)
    clearRole()
    if (res.code) {
      message.error("添加失败")
      return
    }
    message.success(res.msg)
    gvfTable.value.refresh()
  } catch (error) {
    clearRole()
    message.error(error.message)
  }
}

// 修改 roleEdit 函数
async function roleEdit(roleId) {
  try {
    const res = await fetchRolePermissionIDsApi(roleId[0]); // 调用获取角色权限ID的 API

    if (res.code) {
      message.error(res.msg);
      return;
    }

    checkedList.value = res.data;
    console.log(res.data)
    data.roleEditVisible = true;
    data.roleId = roleId[0];
  } catch (error) {
    console.error(error);
    // 处理错误情况
  }
}

async function roleDelete(roleId) {
  let res = await deleteRoleByIdApi(roleId[0])
  if (res.code) {
    message.error(res.msg)
    return
  }
  message.success(res.msg)
  gvfTable.value.refresh()
}

function clearRole() {
  data.role = {
    role_name: "",
    description: ""
  }
}

async function getPermission() {
  let res = await queryPermissionAllApi()
  data.permission = res.data
}

getPermission()

</script>

<style>

</style>