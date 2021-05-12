import * as filtersFun from '@/util/filters.js'
// 柱状图Y轴滚动
function scrollYBarChart(category_data, series_data) {
    return {
        grid: {
            left: '3%',
            right: '3%',
            top: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            name: '',
            type: 'value',
            // x坐标轴线是否显示
            axisLine: {
                show: false
            },
            // x坐标轴刻度是否显示
            axisTick: {
                show: false
            },
            // x轴坐标label文本设置
            axisLabel: {
                show: false
            },
            // x轴在grid中的分割线
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: category_data,
            // y坐标轴线是否显示
            axisLine: {
                show: false
            },
            // y轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                color: '#ffffff'
            },
            // y坐标轴刻度是否显示
            axisTick: {
                show: false
            },
            inverse: true
        },
        series: [
            {
                type: 'bar',
                // [18203, 23489, 29034, 4970, 31744, 30230, 33622, 99999]
                data: series_data,
                label: {
                    show: true,
                    position: 'insideLeft',
                    fontSize: 10,
                    color: '#fff',
                    formatter: e => {
                        return filtersFun.numFormat(e.data)
                    }
                },
                // 设置柱子宽度
                barWidth: 18,
                itemStyle: {
                    color: (e) => {
                        if (e.dataIndex <= 2) {
                            return '#FF9900'
                        } else {
                            return '#2D8CF0'
                        }
                    },
                    barBorderRadius: [0, 4, 4, 0]
                }
            }
        ]
    }
}

export default scrollYBarChart