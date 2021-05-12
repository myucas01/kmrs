export default class lineOption {
  constructor(params = {}) {
    const {
      startColor,
      endColor,
      xData,
      seriesData,
    } = params;
    this.grid = {
      show: true,
      top: 0,
      left: 22,
      right: 22,
      bottom: 0,
      borderWidth: 0,
      containLabel: true,
    };
    this.tooltip = {
      trigger: 'axis',
      backgroundColor: '#A634EF',
      axisPointer: {
        type: 'none',
      },
      formatter: (params) => {
        let res = '';
        if (params && params.length) {
          res = params[0].value.toString().replace(/\d+/, function (n) {
            // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
              return $1 + ","
            });
          });
          return res
        }
      },
    };
    this.xAxis = {
      type: 'category',
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: {
        fontSize: 10,
        color: '#fff',
        fontStyle: 'oblique'
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      data: xData || [],
    };
    this.yAxis = {
      type: 'value',
      show: false,
      splitLine: { show: false },
      axisLabel: { show: false, }
    };
    this.series = [{
      data: seriesData || [],
      type: 'line',
      showSymbol: false,
      lineStyle: {
        width: 0,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0, color: startColor // 0% 处的颜色
            }, {
              offset: 1, color: endColor // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
      }
    }];
  }
}