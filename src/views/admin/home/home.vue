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
          <a-tooltip title="用户已使用的容量占比">
            <a-progress :percent="parseFloat(data.storePercent)" :success="{ percent: parseFloat(data.storePercent) }"
                        type="circle"/>
          </a-tooltip>
        </div>
        <div class="process_size">
          <div class="process_text">共享限额</div>
          <a-tooltip title="用户可分享文件限制">
            <a-progress :percent="5" :success="{ percent: 5 }" type="circle"/>
          </a-tooltip>
        </div>
        <div class="process_size">
          <div class="process_text">文件夹限制</div>
          <a-tooltip title="用户可新建文件夹限制">
            <a-progress :percent="6" :success="{ percent: 6 }" type="circle"/>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div class="chart_item">
    </div>
  </div>
  <div class="gvf_data_login">
    <div class="process_chart">
      <div class="chart_login"></div>
    </div>
  </div>
</template>

<script setup>

import {ref, reactive, onMounted} from "vue";
import {queryStoreByUserIdApi} from "../../../api/store_api"
import {getLoginCountApi} from "../../../api/user_api"
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
      value: 6,
    },
    {
      label: "文件",
      value: 8,
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
  detailUse: {},
  loginCount: {},
  xAxisData: {},
  yAxisData: {}
})

let xAxisData = {}
let yAxisData = {}

const chartInstance = ref(null);

const chartLogin = ref(null)

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
  let chart1 = chartInstance.value
  let updateOption1 = {
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
  chart1.setOption(updateOption1)
  console.log(res)
  console.log(data.detailUse)
  data.sumDataList[1] = {
    label: "文件",
    value: data.detailUse.docCount + data.detailUse.imgCount + data.detailUse.musicCount + data.detailUse.videoCount
        + data.detailUse.otherCount
  }

  res = await getLoginCountApi()
  data.loginCount = res.data
  data.xAxisData = data.loginCount.map(item => item.date.split("T")[0]);// 日期数据
  data.yAxisData = data.loginCount.map(item => item.count); // 次数数据
  let chart2 = chartLogin.value
  let updateOption2 = {
    legend: {
      data: ['登录次数']
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '登录次数',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(50, 100, 255)'
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: data.yAxisData
      }
    ]
  }
  chart2.setOption(updateOption2)
}

onMounted(() => {
  const myChartFile = echarts.init(document.querySelector(".chart_item")); // 创建 echarts 实例
  const optionFile = {
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
  myChartFile.setOption(optionFile); // 绑定到容器中
  chartInstance.value = myChartFile;

  const myChartLogin = echarts.init(document.querySelector(".chart_login")); // 创建 echarts 实例
  const optionLogin = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    title: {
      text: '用户登陆概况'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
  };
  myChartLogin.setOption(optionLogin); // 绑定到容器中
  chartLogin.value = myChartLogin;
})

getFileDetail()
getStoreInfo()
</script>

<style lang="scss">
.gvf_data_preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
  padding-top: 18px;
  padding-right: 18px;
  padding-left: 18px;
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
  padding: 0 18px;
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

.gvf_data_login {
  padding-top: 18px;
  padding-right: 18px;
  padding-left: 18px;
  height: 296px;

  .process_chart {
    padding-top: 18px;
    padding-right: 18px;
    padding-left: 18px;
    background-color: var(--card_bg);
    border-radius: 5px;
    border: 1px solid var(--card_border);
    height: 100%;

    .chart_login {
      border-radius: 5px;
      padding: 8px;
      height: 100%;
    }
  }
}

</style>