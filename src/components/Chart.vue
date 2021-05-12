<template>
  <chart :options="options" :autoResize="true" ref='thisChart'></chart>
</template>

<script>
import Vue from 'vue';
import ECharts from 'vue-echarts';

/*---------------------导入GEO-JSON中国地图---------------------*/
import CHINA_GEO_JSON from '@assets/CHINA_GEO_JSON.json'
console.log('中国地图GEOJson：', CHINA_GEO_JSON)
ECharts.registerMap('CHINA', CHINA_GEO_JSON)

Vue.component('chart', ECharts);

export default {
  name: 'echartsWrapper',
  props: {
    options: {},
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100% !important;
  height: 100% !important;
}
</style>