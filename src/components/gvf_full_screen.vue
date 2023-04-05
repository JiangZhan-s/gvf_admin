<template>
  <i v-if="!isFull" @click="fullScreen" class="fa fa-arrows-alt"></i>
  <i v-else @click="fullScreen" class="fa fa-compress"></i>
</template>

<script setup>

import {ref} from "vue";

const isFull = ref(false)

function isFullScreen() {
  return document.fullscreenElement != null

}

function exitFullScreen() {
  let exitMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreen;
  if (exitMethod) {
    exitMethod.call(document);
  } else if (typeof window.ActiveXObject !== "undefined") {
    let wscript = new ActiveXObject("WScript.Shell");
    if (wscript != null) {
      wscript.SendKeys("{F11}");
    }
  }
}

function fullScreen() {
  let element = document.documentElement
  isFull.value = !isFull.value
  //判断是否处于全屏
  if (isFullScreen()) {
    exitFullScreen()
    return
  }

  let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
    let wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}
</script>