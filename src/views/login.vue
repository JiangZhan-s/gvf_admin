<template>
  <div class="gvf_login_bg">
    <div class="gvf_login_container">
      <div class="gvf_login_main">
        <div class="gvf_login_head">用户登录</div>
        <div class="gvf_login_form">
          <div class="gvf_login_form_item">
            <a-input placeholder="用户名" v-model:value="data.user_name">
              <template #prefix><i class="fa fa-user-o"></i></template>
            </a-input>
          </div>
          <div class="gvf_login_form_item">
            <a-input type="password" placeholder="密码" v-model:value="data.password">
              <template #prefix><i class="fa fa-key"></i></template>
            </a-input>
          </div>
          <div class="gvf_login_form_item">
            <a-button type="primary" @click="emailLogin">登录</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {reactive} from "vue";
import {message} from 'ant-design-vue';
import {emailLoginApi, getUserIPApi, getCityFromIP} from "../api/user_api";
import {parseToken} from "../utils/jwt";
import {useStore} from "@/stores/store";
import {useRoute, useRouter} from "vue-router";
import {folderRootFindApi} from "../api/folder_api";

const route = useRoute()
const router = useRouter()
const store = useStore()
const data = reactive({
  user_name: "",
  password: "",
  ip: "",
  city: "",
})

async function getUserIP() {
  let res = await getUserIPApi()
  data.ip = res
  res = await getCityFromIP(data.ip)
  data.city = res
  console.log(res)
}


async function emailLogin() {
  if (data.user_name.trim() === "") {
    message.error("请输入用户名")
    return
  }
  if (data.password.trim() === "") {
    message.error("请输入密码")
    return
  }

  await getUserIP()
  let res = await emailLoginApi(data)
  if (res.code) {
    message.error(res.msg)
    return
  }
  //res.data就是jwt的token
  message.success(res.msg)
  let userInfo = parseToken(res.data)
  userInfo.token = res.data
  store.setUserInfo(userInfo)
  res = await folderRootFindApi()
  if (res.code) {
    message.error(res.msg)
    return
  }
  console.log(res.data)
  store.setFolderRoot(res.data)

  if (userInfo.role === 1) {
    setTimeout(() => {
      router.push({name: "users"})
    }, 1000)
    return
  }

  const redirect_url = route.query.redirect_url
  if (redirect_url === undefined) {
    setTimeout(() => {
      router.push({name: "home"})
    }, 1000)
    return
  }
  //登陆成功后跳转
  setTimeout(() => {
    router.push({path: redirect_url})
  }, 1000)
}

</script>

<style lang="scss">
.gvf_login_bg {
  background: url('../assets/images/bg.jpg') 50%/cover no-repeat;
  width: 100%;
  height: 100vh;
}

.gvf_login_container {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background-color: rgba(white, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;

  .gvf_login_main {
    width: 70%;

    .gvf_login_head {
      font-size: 22px;
      font-weight: 600;
      color: var(--active);
      text-align: center;
      margin-bottom: 10px;
    }

    .gvf_login_form {
      .gvf_login_form_item {
        margin-bottom: 10px;

        .ant-btn {
          width: 100%;
        }
      }
    }

    .gvf_login_other {
      font-size: 14px;
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;

      &::before {
        width: 34%;
        height: 1px;
        background-color: #666;
        display: inline-block;
        content: "";
        margin-right: 5px;
      }

      &::after {
        width: 34%;
        height: 1px;
        background-color: #666;
        display: inline-block;
        content: "";
        margin-left: 5px;
      }
    }

    .gvf_login_other_icons {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .gvf_login_other_icon {
        width: 40px;
        height: 40px;
        cursor: pointer;
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>