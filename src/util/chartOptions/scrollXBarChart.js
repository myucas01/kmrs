// 柱状图x轴滚动 + 折线图
import * as filtersFun from '@/util/filters.js'
function scrollXBarChart (category_data, bar_data, line_data) {
    return {
        // 决定折线图在容器内的大小，xy为偏移量
        grid: {
            left: '2%', // x 偏移量
            top: '2%', // y 偏移量
            bottom: 30,
            width: '95%', // 宽度,
            containLabel: false
        },
        xAxis: {
            type: 'category',
            data: category_data,
            axisPointer: {
                type: 'shadow'
            },
            // x坐标轴线是否显示
            axisLine: {
                lineStyle: {
                    color: '#BBBEC4'
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
                color: '#ffffff'
            }
        },
        yAxis: [
            {
                show: false
            },
            {
                show: false
            }
        ],
        series: [
            {
                name: '门店数',
                type: 'bar',
                // 设置柱子宽度
                barWidth: 14,
                itemStyle: {
                    color: (e) => {
                        if (e.dataIndex <= 2) {
                            return '#FF9900'
                        } else {
                            return '#2D8CF0'
                        }
                    },
                    // 设置柱子为圆角
                    barBorderRadius: [4, 4, 0, 0]
                },
                data: bar_data
            },
            {
                name: 'TGI指数',
                type: 'line',
                // 是否平滑过渡
                smooth: true,
                // 打点图形：空心圆
                symbol: 'circle',
                // 打点大小
                symbolSize: 4,
                // 平滑曲线的样式
                lineStyle: {
                    type: 'dashed',
                    // 线宽
                    width: 1,
                    color: '#ffffff'
                },
                itemStyle: {
                    color: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    opacity: 0.7
                },
                data: line_data
            }
        ],
        // 鼠标经过提示
        tooltip: {
            trigger: 'axis',
            // 十字线显示
            axisPointer: {
                type: 'none'
            },
            backgroundColor: 'transparent',
            // 文本样式
            textStyle: {
                color: '#ffffff',
                fontSize: 10
            },
            formatter: params => {
                return (
                    '<div style="background-color:rgba(121,9,193,0.7);padding:6px; border-radius:4px;">' +
                        '<div style="font-size:14px;margin-bottom:8px;font-weight:bold">' + params[0].name + '</div>' +
                        '<div><span style="width:40px; display:inline-block">' + params[0].seriesName + '</span> ' + filtersFun.numFormat(params[0].data) + '</div>' +
                        '<div><span style="width:40px; display:inline-block">' + params[1].seriesName + '</span> ' + filtersFun.numFormat(params[1].data) + ' %</div>' +
                    '</div>'
                )
            }
        }
    }
}

export default scrollXBarChart