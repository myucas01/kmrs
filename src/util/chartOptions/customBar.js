import * as filtersFun from '@/util/filters.js'
export default class customBar {
  constructor(params = {}) {
    const {
      color,
      seriesData,
      xaxisMax,
      xaxisMin
    } = params;
    this.color = color || ['#A634EF'];
    this.grid = {
      top: 30,
      left: 25,
      right: 15,
      bottom: 20,
      containLabel: true,
    };
    this.xAxis = {
      type: 'value',
      splitLine: { show: false },
      min: xaxisMin,
      max: xaxisMax,
      name: params.xName,
      nameLocation: 'middle',
      nameGap:20,
      nameTextStyle: {
        color: '#ffffff'
      },
      axisLabel: {
        fontSize: 10,
        color: '#fff'
      },
      axisLine: {
        lineStyle: {
          color: '#bbbec4',
        }
      },
      axisTick: {
        show: false,
      },
    };
    this.yAxis = {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#5E29A4',
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
        color: '#fff',
      },
      name: params.yName,
      nameLocation: 'end',
      nameGap:10,
      nameTextStyle: {
        color: '#ffffff',
        align:'left'
      }
    };
    this.series = [{
      name: '',
      type: 'custom',
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
      },
      renderItem: function(params, api) {
          var yValue = api.value(2);
          var start = api.coord([api.value(0), yValue]);
          var size = api.size([api.value(1) - api.value(0), yValue]);
          var style = api.style();
          return {
            type: 'rect',
            shape: {
                x: start[0] + 1,
                y: start[1],
                width: size[0] - 2,
                height: size[1]
            },
            style: style
          };
      },
      label: {
          show: false,
          position: 'top'
      },
      encode: {
          x: [0, 1],
          y: 2,
          tooltip: 2,
          label: 2
      },
      data: seriesData || [],
    }];
    this.tooltip = {
        trigger: 'item',
        backgroundColor: 'transparent',
        // 文本样式
        textStyle: {
            color: '#ffffff',
            fontSize: 10
        },
        formatter: params => {
            return (
                '<div style="background-color:rgba(121,9,193,0.7);padding:6px; border-radius:4px;">' +
                '<div style="font-size:12px;margin-bottom:8px">区间范围：' + params.data[0] + '~' + params.data[1] +'</div>' +
                '<div><span style="font-size:12px; display:inline-block">数量：' + filtersFun.numFormat(params.data[2]) + '</span></div>' +
                '</div>'
            )
        }
    }
  }
}