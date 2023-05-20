<template>
  <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :inline-collapsed="false"
      :open-keys="data.openKeys"
      @click="goto"
      @openChange="onOpenChange"
  >
    <template v-for="menu in data.menuList" :key="menu.name">
      <a-menu-item :key="menu" v-if="menu.children.length===0">
        <template #icon>
          <i :class="'fa '+menu.icon"></i>
        </template>
        <span>{{ menu.title }}</span>
      </a-menu-item>

      <a-sub-menu :key="menu.id" v-else>
        <template #icon>
          <i :class="'fa '+menu.icon"></i>
        </template>
        <template #title>{{ menu.title }}</template>
        <a-menu-item v-for="sub_menu in menu.children" :key="sub_menu">
          <template #icon>
            <i :class="'fa '+sub_menu.icon"></i>
          </template>
          <span>{{ sub_menu.title }}</span>
        </a-menu-item>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script setup>
import {reactive, ref} from "vue";
import {useRouter, useRoute, onBeforeRouteUpdate} from "vue-router"
import {useStore} from "@/stores/store";

const store = useStore()
const selectedKeys = ref([])
const data = reactive({
  menuList: [
    {
      id: 1,
      icon: "fa-home",//图标统一用fa
      title: "首页",//菜单名称
      name: "home",//路由名称
      children: []
    },
    {
      id: 2,
      icon: "fa-upload",//图标统一用fa
      title: "上传文件",//菜单名称
      name: "upload",//路由名称
      children: []
    },
    {
      id: 3,
      icon: "fa-folder-open",//图标统一用fa
      title: "全部文件",//菜单名称
      name: "files",//路由名称
      children: []
    },
    {
      id: 4,
      icon: "fa-th-large",//图标统一用fa
      title: "文件格式",//菜单名称
      name: "",//路由名称
      children: [
        {
          id: 5,
          icon: "fa-file-text-o",//图标统一用fa
          title: "文档",//菜单名称
          name: "file_text",//路由名称
          children: []
        },
        {
          id: 6,
          icon: "fa-file-movie-o",//图标统一用fa
          title: "影音",//菜单名称
          name: "file_movie",//路由名称
          children: []
        },
        {
          id: 7,
          icon: "fa-file-picture-o",//图标统一用fa
          title: "图片",//菜单名称
          name: "file_picture",//路由名称
          children: []
        },
      ]
    },
    {
      id: 8,
      icon: "fa fa-slideshare",
      title: "分享管理",
      name: "shares_msg",
      children: [
        {
          id: 9,
          icon: "fa fa-slideshare",
          title: "我的分享",
          name: "shares",
          children: []
        },
        {
          id: 10,
          icon: "fa fa-link",
          title: "提取文件",
          name: "share_file",
          children: []
        }
      ]
    },
    {
      id: 11,
      icon: "fa fa-gear",
      title: "系统管理",
      name: "settings",
      children: [
        {
          id: 12,
          icon: "fa fa-address-card-o",
          title: "用户管理",
          name: "users",
          children: []
        },
        {
          id: 13,
          icon: "fa fa-group",
          title: "角色管理",
          name: "roles",
          children: []
        },
        {
          id: 14,
          icon: "fa fa-clock-o",
          title: "登录信息",
          name: "login_data",
          children: []
        },
        {
          id: 15,
          icon: "fa fa-database",
          title: "区块链信息",
          name: "share_file",
          children: []
        }
      ]
    },
    {
      id: 16,
      icon: "fa fa-list-alt",
      title: "文件夹模式",
      name: "folder_file",
      children: []
    },

  ],
  openKeys: []
})
const router = useRouter()
const route = useRoute()

function goto(item) {
  store.addTab({
    name: item.key.name,
    title: item.key.title
  })
  //加入到 tabs
  router.push({
    name: item.key.name,
  })
}

function onOpenChange(openKeys) {
  const latestOpenKey = openKeys.find(key => data.openKeys.indexOf(key) === -1)
  data.openKeys = latestOpenKey ? [latestOpenKey] : []
}

function loadRoute(name) {
  if (name === undefined) {
    name = route.name
  }
  for (const menu of data.menuList) {
    if (menu.name === name) {
      selectedKeys.value = [menu]
      return
    }
    for (const subMenu of menu.children) {
      if (subMenu.name === name) {
        //找到id，展开对应的菜单
        data.openKeys = [menu.id]
        selectedKeys.value = [subMenu]
        return
      }
    }
  }
}

onBeforeRouteUpdate((to, from, next) => {
  loadRoute(to.name)
  next()
})
loadRoute()

</script>

<style>
.ant-menu {
  background-color: var(--slide_bg);
  color: white;
}

.ant-menu-submenu-arrow {
  color: white;
}

.ant-menu-sub.ant-menu-inline {
  background-color: var(--slide_sub_bg);
}

.ant-menu-inline .ant-menu-item {
  margin-top: 0;
  margin-bottom: 0;
}

/*.ant-menu-item {*/
/*  margin-bottom: 0;*/
/*  margin-top: 0;*/
/*}*/

</style>