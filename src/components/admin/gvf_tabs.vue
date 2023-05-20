<template>
  <div class="gvf_tabs">
    <div :class=isActive(item)
         v-for="(item,index) in store.tabList"
         :key="index"
         @click="checkTab(item)"
    >
      {{ item.title }}
      <span @click.stop="removeTab(item)" v-if="item.name !== 'home'" class="gvf_tab_remove_icon">×</span>
    </div>


    <div @click="removeTabAll" class="gvf_tab_item remove_all">
      全部关闭
    </div>
  </div>
</template>

<script setup>

import {useStore} from "@/stores/store";
import {useRoute, useRouter} from "vue-router";
import {folderRootFindApi} from "../../api/folder_api";
import {message} from "ant-design-vue";

const store = useStore()
const route = useRoute()
const router = useRouter()

function isActive(item) {
  //判断当前路由是否和item上的路由匹配
  //还要判断是不是home
  if (route.name === item.name) {
    return "gvf_tab_item active"
  }
  return "gvf_tab_item"
}

async function checkTab(item) {
  let res = await folderRootFindApi()
  if (res.code) {
    message.error(res.msg)
    return
  }
  console.log(res.data)
  store.setFolderRoot(res.data)


  await router.push({
    name: item.name
  })
}

function removeTab(item) {
  let index = store.removeTab(item)
  //如果删除的是当前所带的tab
  //向前走一步
  if (item.name === route.name) {
    //当前tab
    //找到前一个路由
    let beforeIndex = index - 1
    let beforeName = store.tabList[beforeIndex].name
    router.push({
      name: beforeName
    })
  }
}

function removeTabAll() {
  store.removeTabAll()
  router.push({
    name: "home"
  })
}

store.loadTab()
window.onbeforeunload = function () {
  store.saveTab()
  return undefined
}

</script>

<style lang="scss">

.gvf_tabs {
  height: 30px;
  border-color: var(--order);
  border-style: solid;
  border-width: 1px 0 1px 0;
  background-color: var(--card_bg);
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;

  .gvf_tab_item {
    background-color: var(--card_bg);
    border: 1px solid var(--card_border);
    padding: 0 10px;
    margin-right: 10px;
    cursor: pointer;
    color: var(--text);
    display: flex;
    align-items: center;

    .gvf_tab_remove_icon {
      cursor: pointer;
      width: 8px;
      height: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 5px;
      border-radius: 50%;

      &:hover {
        background-color: #f0eeee;
      }
    }

    &:first-child {
      margin-left: 20px;
    }

    &.active {
      background-color: var(--active);
      border-color: var(--active);
      color: white;

      &::before {
        display: inline-block;
        content: "";
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        margin-right: 5px;
      }

      .gvf_tab_remove_icon:hover {
        background-color: #8fbef3;
      }
    }

    &.remove_all {
      position: absolute;
      right: 10px;
      top: 0;
    }
  }
}
</style>