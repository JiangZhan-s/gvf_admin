<template>
  <div class="gvf_user_info">
    <div class="avatar" v-if="props.isAvatar">
      <img src="https://img95.699pic.com/element/40151/6832.png_300.png" alt="">
    </div>
    <div class="drop_menu">
      <a-dropdown placement="bottomRight">
        <a class="ant-dropdown-link" @click.prevent>
          {{ userNick }}
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
import {logoutApi} from "../api/user_api";
import {message} from "ant-design-vue";
import {useStore} from "@/stores/store";
import {reactive} from "vue";

const store = useStore()
const route = useRoute()
const router = useRouter()
const props = defineProps({
  //是否显示头像部分
  isAvatar: {
    type: Boolean,
    default: false,
  }
})
const userNick = store.userInfo.nick_name

async function userLogout() {
  let res = await logoutApi();
  message.success(res.msg)
  await router.push({
    name: "login",
  })
}

function menuClick({key}) {
  if (key === "logout") {
    console.log("logout")
    userLogout()
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