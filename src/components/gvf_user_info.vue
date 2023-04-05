<template>
  <div class="gvf_user_info">
    <div class="avatar">
      <img src="https://img95.699pic.com/element/40151/6832.png_300.png" alt="">
    </div>
    <div class="drop_menu">
      <a-dropdown placement="bottomRight">
        <a class="ant-dropdown-link" @click.prevent>
          江湛
          <i class="fa fa-angle-down"></i>
        </a>
        <template #overlay>
          <a-menu @click="menuClick">
            <a-menu-item key="user_center">
              <a href="javascript:">个人中心</a>
            </a-menu-item>
            <a-menu-item key="file_store">
              <a href="javascript:">我的仓库</a>
            </a-menu-item>
            <a-menu-item key="logout">
              <a href="javascript:">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup>

import {useRouter} from "vue-router/dist/vue-router";

const router = useRouter()

function menuClick({key}) {
  if (key === "logout") {
    console.log("logout")
    return
  }
  router.push({
    name: key
  })
}
</script>


<style>
.gvf_user_info {
  display: flex;
  align-items: center;
}
</style>