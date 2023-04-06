<template>
  <div class="gvf_aside">
    <div>
      <div class="gvf_aside_header flex">
        <div class="gvf_aside_logo flex">
          <img
              src="../../assets/logo.png"
              alt="">
        </div>
        <div class="gvf_aside_title">数据管理系统</div>
      </div>
      <div class="gvf_aside_body flex">
        <GVFAsideMenu></GVFAsideMenu>
      </div>
    </div>
  </div>
</template>

<script setup>

import GVFAsideMenu from "./gvf_aside_menu.vue"

</script>

<style lang="scss">
.gvf_aside {
  width: 240px;
  height: 100vh;
  background-color: var(--slide);

  .gvf_aside_header {
    width: 100%;
    height: 180px;
    flex-direction: column;
  }

  .gvf_aside_logo {
    padding: 10px;

    img {
      width: 100%;
    }

  }

  .gvf_aside_title {
    font-size: 20px;
    color: #e7e7e7;
  }
}


</style>