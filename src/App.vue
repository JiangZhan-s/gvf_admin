<template>
  <router-view/>
</template>

<script setup>
import {useStore} from "@/stores/store";

const store = useStore()

store.loadUserInfo()
</script>


<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

:root {
  --active: #1890ff;
  --text: #555
}
</style>