<template>
  <div class="container" :class="{'sign-up-mode' : isSignUpMode}">
    <div class="forms-container">
      <div class="signin-signup">
        <form action="#" class="sign-in-form">
          <h2 class="title">登录</h2>
          <div class="input-field">
            <i class="fa fa-user"></i>
            <a-input class="input-new" placeholder="用户名"
                     v-model:value="data.user_name">
            </a-input>
          </div>
          <div class="input-field">
            <i class="fa fa-lock"></i>
            <a-input class="input-new" type="password" placeholder="密码"
                     v-model:value="data.password">
            </a-input>
          </div>
          <input type="button" value="登 录" id="LoginButton" class="btn solid" @click="emailLogin"/>
          <p class="social-text">忘记密码</p>
        </form>
        <form action="#" class="sign-up-form">
          <h2 class="title">注册</h2>
          <div class="input-field">
            <i class="fa fa-user"></i>
            <a-input class="input-new" @input="validateUsername" placeholder="用户名"
                     v-model:value="register.user_name"/>
            <span class="error-bubble" v-if="!isUsernameValid">{{ usernameError }}</span>
          </div>
          <div class="input-field">
            <i class="fa fa-address-card"></i>
            <a-input class="input-new" placeholder="昵称"
                     v-model:value="register.nick_name"/>
          </div>
          <div class="input-field">
            <i class="fa fa-envelope"></i>
            <a-input class="input-new" @input="validateEmail" type="email" placeholder="邮箱"
                     v-model:value="register.email"/>
            <span class="error-bubble" v-if="!isEmailValid">邮箱格式不正确</span>
          </div>
          <div class="input-field">
            <i class="fa fa-phone"></i>
            <a-input class="input-new" @input="validatePhoneNumber" placeholder="手机号"
                     v-model:value="register.tel"/>
            <span class="error-bubble" v-if="!isPhoneNumberValid">手机号格式不正确</span>
          </div>
          <div class="input-field">
            <i class="fa fa-lock"></i>
            <a-input type="password" class="input-new" placeholder="密码"
                     v-model:value="register.password" @input="validatePassword"/>
            <span class="error-bubble" v-if="!isPasswordValid">至少包含一个大写字母、一个小写字母和一个数字，长度在6到20之间</span>
          </div>
          <div class="input-field">
            <i class="fa fa-lock"></i>
            <a-input class="input-new" type="password" placeholder="确认密码"
                     v-model:value="register.rePassword" @input="validateRePassword"/>
            <span class="error-bubble" v-if="!isRePasswordValid">两次密码不一致</span>

          </div>
          <input type="submit" class="btn" value="注 册" @click="SignUp"/>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>新用户?</h3>
          <p>
            点击下方注册按钮加入我们吧!!
          </p>
          <button class="btn transparent" id="sign-up-btn" @click="showSignUp">
            注册
          </button>
        </div>
        <img src="../assets/images/login.svg" class="image" alt=""/>
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>已经拥有账号?</h3>
          <p>
            点击登录按钮,登录系统!!
          </p>
          <button class="btn transparent" id="sign-in-btn" @click="showSignIn">
            登 录
          </button>
        </div>
        <img src="../assets/images/register.svg" class="image" alt=""/>
      </div>
    </div>
  </div>

</template>

<script setup>

import {reactive, ref} from "vue";
import {message} from 'ant-design-vue';
import {emailLoginApi, getUserIPApi, getCityFromIP, signUpApi} from "../api/user_api";
import {parseToken} from "../utils/jwt";
import {useStore} from "@/stores/store";
import {useRoute, useRouter} from "vue-router";
import {folderRootFindApi} from "../api/folder_api";

const route = useRoute()
const router = useRouter()
const store = useStore()
const isEmailValid = ref(true)
const isPasswordValid = ref(true)
const isPhoneNumberValid = ref(true);
const isRePasswordValid = ref(true);
const isUsernameValid = ref(true);
const usernameError = ref('');
const isSignUpMode = ref(false);


const data = reactive({
  user_name: "",
  password: "",
  ip: "",
  city: "",
})

const register = reactive({
  user_name: "",
  nick_name: "",
  password: "",
  rePassword: "",
  email: "",
  tel: ""
})

// 手机号格式检测
const validatePhoneNumber = () => {
  const phoneNumberRegex = /^1[0-9]{10}$/; // 11位数字，以1开头
  isPhoneNumberValid.value = phoneNumberRegex.test(register.tel);
};

const validateRePassword = () => {
  isRePasswordValid.value = (register.password === register.rePassword)
}

const validateUsername = () => {
  isUsernameValid.value = false
  if (register.user_name.length < 3 || register.user_name.length > 10) {
    usernameError.value = '用户名长度必须在3到10个字符之间';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(register.user_name)) {
    usernameError.value = '用户名只能包含字母、数字、下划线和减号';
  } else {
    usernameError.value = '';
    isUsernameValid.value = true
  }
}

const validatePassword = () => {
  // 密码要求：至少包含一个大写字母、一个小写字母和一个数字，长度在6到20之间
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/;
  isPasswordValid.value = passwordRegex.test(register.password);
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isEmailValid.value = emailRegex.test(register.email);
}

const showSignUp = () => {
  isSignUpMode.value = true;
};

const showSignIn = () => {
  isSignUpMode.value = false;
};


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
  //获取用户IP，由于网络延迟，暂不使用
  // await getUserIP()
  let res = await emailLoginApi(data)
  if (res.code) {
    message.error(res.msg)
    return
  }
  //res.data就是jwt的token
  message.success(res.msg)
  let userInfo = parseToken(res.data)
  console.log(userInfo)
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

async function SignUp() {
  if (!isUsernameValid || !isRePasswordValid ||
      !isPhoneNumberValid || !isPasswordValid ||
      !isEmailValid
  ) {
    message.warn("请检查输入格式是否是正确")
    return
  }
  let res = await signUpApi(register)
  if (res.code) {
    message.error(res.msg)
    return
  }
  message.success(res.msg)
  setTimeout(() => {
    router.push({name: "login"})
  }, 2000)
}

</script>

<style lang="scss">

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.error-bubble {
  padding-left: 32px;
  display: inline-block;
  color: red;
  width: 500px;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-new {
  background-color: #f0f0f0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 150px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.left-panel {
  align-items: center;
  display: flex;
  justify-content: center;
}

.right-panel {
  align-items: center;
  display: flex;
  justify-content: center;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
  color: white;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

</style>