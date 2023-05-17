<template>
  <div class="gvf_data_preview">
    <div class="preview_item" v-for="(item,index) in data.sumDataList" :key="index">
      <div class="icon">
        <i :class="'iconfont '+iconList[index]"></i>
      </div>
      <div class="text">
        <div class="data_title">{{ item.label }}</div>
        <div class="data_sum">{{ item.value }}</div>
      </div>
    </div>
  </div>
  <div class="gvf_data_item">
    <div class="process_item">
      <div class="title">概况</div>
      <div class="data_process">
        <div class="process_size">
          <div class="process_text">容量</div>
          <a-tooltip title="3 done / 3 in progress / 4 to do">
            <a-progress :percent="data.storePercent" :success="{ percent: data.storePercent }" type="circle"/>
          </a-tooltip>
        </div>
        <div class="process_size">
          <div class="process_text">共享限额</div>
          <a-tooltip title="3 done / 3 in progress / 4 to do">
            <a-progress :percent="5" :success="{ percent: 5 }" type="circle"/>
          </a-tooltip>
        </div>
        <div class="process_size">
          <div class="process_text">容量</div>
          <a-tooltip title="3 done / 3 in progress / 4 to do">
            <a-progress :percent="data.storePercent" :success="{ percent: data.storePercent }" type="circle"/>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div class="chart_item">
    </div>
  </div>
</template>

<script setup>

import {ref, reactive, onMounted} from "vue";
import {queryStoreByUserIdApi} from "../../../api/store_api"
import {fileDetailApi} from "../../../api/file_api"
import * as echarts from 'echarts';

const iconList = [
  "icon-a-wenjianjiawenjian",
  "icon-wenjian1",
  "icon-fenxiang",
]

const data = reactive({
  sumDataList: [
    {
      label: "文件夹",
      value: 21,
    },
    {
      label: "文件",
      value: 60,
    },
    {
      label: "已分享",
      value: 5,
    },
  ],
  storeInfo: {
    current_size: 0,
    max_size: 0,
  },
  storePercent: 40,
  detailUse: {}
})

const chartInstance = ref(null);

async function getStoreInfo() {
  let res = await queryStoreByUserIdApi()
  data.storeInfo.current_size = res.data.current_size
  data.storeInfo.max_size = res.data.max_size
  data.storePercent = data.storeInfo.current_size * 100 / data.storeInfo.max_size
  data.storePercent = data.storePercent.toFixed(2)
}

async function getFileDetail() {
  let res = await fileDetailApi()
  data.detailUse = res.data
  console.log(data.detailUse)
  let chart = chartInstance.value
  let updateOption = {
    series: [
      {
        name: '文件类型',
        type: 'pie',
        left: -90,
        top: 30,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + ' (' + param.percent + '%)';
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          {value: data.detailUse.docCount, name: '文档'},
          {value: data.detailUse.imgCount, name: '图片'},
          {value: data.detailUse.musicCount, name: '音乐'},
          {value: data.detailUse.videoCount, name: '视频'},
          {value: data.detailUse.otherCount, name: '其他'}
        ]
      }
    ]
  };
  chart.setOption(updateOption)
}

onMounted(() => {
  const myChart = echarts.init(document.querySelector(".chart_item")); // 创建 echarts 实例
  const option = {
    title: {
      text: '文件使用明细',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'

    },
    legend: {
      orient: 'vertical',
      top: '30%',
      right: 30,
      bottom: 20,
    },
  };
  myChart.setOption(option); // 绑定到容器中
  chartInstance.value = myChart;
})

getFileDetail()
getStoreInfo()
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

.gvf_data_item {
  display: flex;

  .process_item {
    margin-top: 20px;
    width: 55%;
    display: flex;
    background-color: var(--card_bg);
    border-radius: 5px;
    border: 1px solid var(--card_border);
    padding: 20px;
    flex-direction: column;
    height: 300px;
    margin-right: 2%;

    .title {
      font-size: 20px;
      color: var(--text);
      border-bottom: 1px solid var(--bg);
      height: 15%;
    }

    .data_process {
      height: 80%;
      padding-top: 10px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 30px;

      .process_size {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .process_text {
          color: var(--text);
          margin-bottom: 15px;
        }
      }
    }
  }

  .chart_item {
    margin-top: 20px;
    width: 43%;
    display: flex;
    background-color: var(--card_bg);
    border-radius: 5px;
    border: 1px solid var(--card_border);
    padding: 20px;
    flex-direction: column;
    height: 300px;
  }
}

</style>