// 多折线图
import * as filtersFun from '@/util/filters.js'
function multiLineChart(data = []) {
    let legend = []
    let series = []
    for(let i = 0, len = data.length; i < len; i++) {
        legend.push(data[i].name)
        let obj = {
            name: data[i].name,
            type: 'line',
            // 是否平滑过渡
            smooth: true,
            // 打点图形：空心圆
            symbol: 'circle',
            // 打点大小
            symbolSize: 8,
            // 平滑曲线的样式
            lineStyle: {
                // 线宽
                width: 1
            },
            itemStyle: {
                borderWidth: 2
            },
            data: data[i].data
        }
        series.push(obj)
    }
    return {
        color:['#866CED', '#FAC3FE', '#FE68A3','#FEED84', '#75DEB4', '#FA7D29', '#8ACBF7'],
        legend: {
            data: legend,
            bottom:0
        },
        xAxis: {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisPointer: {
                type: 'shadow'
            },
            // x坐标轴线是否显示
            axisLine: {
                lineStyle: {
                    color: '#E4E5E7'
                }
            },
            // x坐标轴刻度是否显示
            axisTick: {
                show: false
            },
            // x轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                // 距离顶部20
                padding: [0, 0, 0, 0],
                // 强制所有x轴类别都显示
                interval: 0,
                color: '#999999'
            }
        },
        yAxis: {
            type: 'value',
            // x坐标轴线是否显示
            axisLine: {
                lineStyle: {
                    color: '#E4E5E7'
                }
            },
            // x坐标轴刻度是否显示
            axisTick: {
                show: false
            },
            // x轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                // 距离顶部20
                padding: [0, 0, 0, 0],
                // 强制所有x轴类别都显示
                interval: 0,
                color: '#999999'
            },
            // x轴在grid中的分割线
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: '#EEEEEE'
                }
            }
        },
        series: series,
        tooltip: {
            backgroundColor: 'transparent',
            formatter(data) {
                return (
                    '<div style="background-color:#ffffff;padding:6px; border-radius:4px;border:1px solid #930CEA;font-size:12px;color:#333333">' +
                        data.seriesName + '年' + data.name + '<br/>' +
                        '整体场次为：' + filtersFun.numFormat(data.data) +
                    '</div>'
                )
            }
        },
    }
}

export default multiLineChart