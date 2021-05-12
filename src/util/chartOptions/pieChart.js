// 饼图
import * as filtersFun from '@/util/filters.js'
function pieChart(data = []) {
    return {
        color:['#866CED', '#FE68A3', '#FAB8FF', '#FEED84', '#75DEB4', '#FA7D29', '#8ACBF7'],
        grid: {
            left: '3%',
            right: '3%',
            top: '10%',
            bottom: '3%',
            containLabel: true
        },
        series: [
            {
                name: '总场次数',
                type: 'pie',
                radius: ['38%', '60%'],
                data: data,
                label:{
                    color:'#495060',
                    formatter(data) {
                        return data.name + '：' + filtersFun.numFormat(data.value)
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
}

export default pieChart