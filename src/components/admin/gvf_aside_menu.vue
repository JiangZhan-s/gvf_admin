<template>
  <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :inline-collapsed="false"
      @click="goto"
  >
    <template v-for="menu in data.menuList" :key="menu.name">
      <a-menu-item :key="menu.name" v-if="menu.children.length===0">
        <template #icon>
          <i :class="'fa '+menu.icon"></i>
        </template>
        <span>{{ menu.title }}</span>
      </a-menu-item>

      <a-sub-menu :key="menu.name" v-else>
        <template #icon>
          <i :class="'fa '+menu.icon"></i>
        </template>
        <template #title>{{ menu.title }}</template>
        <a-menu-item v-for="sub_menu in menu.children" :key="sub_menu.name">
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
import {useRouter} from "vue-router"

const selectedKeys = ref(["1"])
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
      title: "我的文件",//菜单名称
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
      title: "我的分享",
      name: "shares",
      children: []
    }
  ]
})
const router = useRouter()

function goto(event) {
  router.push({
    name: event.key,
  })
}

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