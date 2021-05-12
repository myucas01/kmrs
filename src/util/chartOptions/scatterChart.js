// 散点图
// import * as filtersFun from '@/util/filters.js'
function scatterChart(data = [], innovateMean = 4.2, likeMean = 5.1) {
    let series_data = []
    for(let i = 0, len = data.length; i < len; i++){
        let obj = {
            type: 'scatter',
            data: data[i],
            itemStyle: {
                color:'#866CED',
                shadowBlur: 2,
                shadowColor: 'rgba(147, 12, 234, 0.23)'
            },
            // 标线
            markLine: {
                // 是否 不响应鼠标事件
                silent: true,
                precision: 2, // 精度
                lineStyle: {
                    type: 'solid',
                    color: '#DADADA'
                },
                // 标线尾部形状
                symbol:'none',
                // 标线文本
                label: {
                    show:false
                },
                data: [
                    {
                        name: 'y', xAxis: innovateMean
                    },
                    {
                        name: 'x', yAxis: likeMean
                    }
                ]
            },
            // 各象限区域
            markArea: {
                silent: true,
                data: [
                    // 第一象限
                    [{
                        // x 轴开始位置
                        xAxis: innovateMean,
                        // y 轴结束位置(直接取最大值)
                        yAxis: 6,
                        itemStyle: {
                            color: '#FBF6FF'
                        },
                        label: {
                            position: 'inside',
                            color: 'rgba(0, 0, 0, .1)',
                            fontSize: 22
                        }
                    }, {
                        yAxis: likeMean // y轴开始位置
                    }]
                ]
            },
            label: {
                show: true,
                position: 'bottom',
                formatter: '{b}',
                color:'#333333'
            }
        }
        series_data.push(obj)
    }
    return {
        grid: {
            left: '10%',
            bottom: '10%',
            right:'3%',
            containLabel: true
        },
        selectedMode : 'single',
        select: {
            label : {
                show: true
            }
        },
        xAxis: {
            name:'概念创新程度(Mean=' + innovateMean + ')',
            nameLocation:'center',
            nameGap:40,
            nameTextStyle:{
                color:'#333333'
            },
            min:1,
            max:5,
            // 是否显示轴线上的刻度
            axisTick: {
                show: false
            },
            // 是否显示轴线
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#EEEFF0'
                }
            },
            splitLine: {
                show:false
            },
            // x轴坐标label文本设置
            axisLabel: {
                fontSize: 10,
                color: '#333333',
                formatter: value => {
                    return value + '.00';
                }
            }
        },
        yAxis: {
            name:'概念喜欢程度(Mean=' + likeMean + ')',
            nameGap:60,
            nameLocation:'center',
            nameTextStyle:{
                color:'#333333',
                fontSize:12
            },
            min:1,
            max:6,
            // 轴线
            axisLine: {
                // 是否显示
                show: true,
                lineStyle: {
                    color: '#EEEFF0'
                }
            },
            // 是否显示轴线上的刻度
            axisTick: {
                show: false
            },
            // y轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                color: '#333333',
                formatter: value => {
                    return value + '.00';
                }
            },
            // x轴在grid中的分割线
            splitLine: {
                show: false
            }
        },
        series: series_data,
        // 鼠标经过提示
        tooltip: {
            trigger: 'item',
            // 文本样式
            textStyle: {
                fontSize: 12
            },
            // 十字线显示
            axisPointer: {
                show: false
            }
        }
    }
}

export default scatterChart