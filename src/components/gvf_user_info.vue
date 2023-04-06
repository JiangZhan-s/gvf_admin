<template>
  <div class="gvf_user_info">
    <div class="avatar" v-if="props.isAvatar">
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
            <a-menu-item key="login">
              <a href="javascript:">用户登录</a>
            </a-menu-item>
            <a-menu-item key="logout">
              <a href="javascript:">注销退出</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup>

import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const props = defineProps({
  //是否显示头像部分
  isAvatar: {
    type: Boolean,
    default: false,
  }
})

function menuClick({key}) {
  if (key === "logout") {
    console.log("logout")
    return
  }
  if (key === "login") {
    router.push({
      name: key,
      query: {
        redirect_url: route.path
      }
    })
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