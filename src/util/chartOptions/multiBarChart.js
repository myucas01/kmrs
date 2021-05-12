// import * as filtersFun from '@/util/filters.js'
function multiBarChart(category_data, negative_data, positive_data) {
    return {
        tooltip: {
            show: false
        },
        grid: {
            left: '8%',
            right: '8%',
            bottom: '3%',
            top: '0%',
            containLabel: true
        },
        xAxis: [
            {
                show: false,
                type: 'value',
                boundaryGap: true,
                axisLabel: {
                    formatter: function (val) {
                        return val + 100
                    }
                }
            }
        ],
        yAxis: {
            type: 'category',
            axisTick: {
                show: true
            },
            // Y轴偏移
            offset: 10,
            // Y轴文本样式
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            },
            data: category_data
        },
        series: [
            {
                name: '收入',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'right',
                    fontSize: 10,
                    color: '#fff'
                },
                itemStyle: {
                    color: '#5CADFF',
                    barBorderRadius: [0, 7, 7, 0]
                },
                // 设置柱子宽度
                barWidth: 14,
                data: positive_data
            },
            {
                name: '支出',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'left',
                    fontSize: 10,
                    color: '#fff',
                    formatter: (value) => {
                        // 值都是负数的 所以需要取反一下
                        return -value.data
                    }
                },
                itemStyle: {
                    color: '#ED3F14',
                    // borderColor: '#ffffff',
                    barBorderRadius: [7, 0, 0, 7]
                },
                data: negative_data
            }
        ]
    }
}

export default multiBarChart