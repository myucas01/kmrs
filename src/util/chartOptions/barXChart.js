// 柱状图x轴滚动 + 折线图
// import * as filtersFun from '@/util/filters.js'
function barXChart(legend = [], y_data = [], is_percent = true) {
    return {
        grid: {
            left: '3%',
            bottom: '3%',
            right:'20%',
            containLabel: true
        },
        xAxis: {
            name:'喜好度',
            nameTextStyle:{
                color:'#A3A3A3'
            },
            type: 'value',
            min: is_percent ? 0 : 1,
            max: is_percent ? 100 : 6,
            // x坐标轴线是否显示
            axisLine: {
                show:false
            },
            // x轴坐标label文本设置
            axisLabel: {
                // 字体大小10
                fontSize: 10,
                // 距离顶部20
                padding: [0, 0, 0, 0],
                color: '#495060'
            },
            // x轴在grid中的分割线
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: '#EEEEEE'
                }
            },
            // x轴刻度是否显示
            axisTick: {
                show:false
            }
        },
        yAxis: {
            name:'品牌',
            nameTextStyle:{
                color:'#A3A3A3'
            },
            type: 'category',
            data: legend,
            // y坐标轴线是否显示
            axisLine: {
                show:false
            },
            // y轴刻度是否显示
            axisTick: {
                show:false
            }
        },
        series: [
            {
                type: 'bar',
                barWidth :20,
                label: {
                    show: true,
                    position: 'right',
                    fontSize: 10,
                    color: '#656565',
                    formatter: (param) => {
                        if(is_percent) {
                            return param.data + '%'
                        }
                        return param.data
                    }
                },
                data: y_data,
                itemStyle:{
                    color: function(params) {
                        // [竞品（粉），本品（蓝）]
                        let colorList = ['#866CED','#FAB8FF']
                        return colorList[params.dataIndex]
                    }
                }
            }
        ]
    };
}

export default barXChart