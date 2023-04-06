<template>
  <div class="gvf_data_preview">
    <div class="preview_item" v-for="(item,index) in data.sum_data_list" :key="index">
      <div class="icon">
        <i :class="'iconfont '+iconList[index]"></i>
      </div>
      <div class="text">
        <div class="data_title">{{ item.label }}</div>
        <div class="data_sum">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {reactive} from "vue";

const iconList = [
  "icon-a-wenjianjiawenjian",
  "icon-wenjian1",
]

const data = reactive({
  sum_data_list: [
    {
      label: "文件夹",
      value: 21,
    },
    {
      label: "文件",
      value: 60,
    },
  ]
})

</script>

<style lang="scss">
.gvf_data_preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
}

.preview_item {
  display: flex;
  background-color: var(--card_bg);
  border-radius: 5px;
  border: 1px solid var(--card_border);
  padding: 20px;

  .icon {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 40px;
      color: var(--active);
    }
  }

  .text {
    width: 40%;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--text);

    .data_title {
      font-weight: 600;
    }

    .data_sum {
      font-size: 18px;
    }
  }
}
</style>