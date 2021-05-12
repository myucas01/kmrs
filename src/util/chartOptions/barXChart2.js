// 柱状图x轴滚动 + 折线图
// import * as filtersFun from '@/util/filters.js'
function barXChart2(legend = [], y_data = [], data = []) {
    let data_arr = []
    for(let i = 0, length = data.length;i < length; i++){
        let obj = {
            // 每个类目的子类目
            name: data[i].name,
            type: 'bar',
            // bar宽度
            barWidth :14,
            // 每个柱的值样式，位置
            label: {
                show: true,
                position: 'right',
                fontSize: 10,
                color: '#656565'
            },
            data: data[i].data
        }
        data_arr.push(obj)
    }
    return {
        color:['#759FFA','#74DDB4'],
        title: {
            text: '【正向指标】',
            textStyle:{
                color:'#4C4C4C',
                fontSize:14
            },
            left:'43%',
            top: 10
        },
        legend: {
            data: legend,
            bottom:10,
            icon: 'circle'
        },
        grid: {
            left: '3%',
            bottom: '15%',
            right:'20%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min:1,
            max:6,
            // x坐标轴线是否显示
            axisLine: {
                show:true,
                lineStyle:{
                    color:'#EEEEEE'
                }
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
                show: false
            },
            // x轴刻度是否显示
            axisTick: {
                show:true
            }
        },
        yAxis: {
            type: 'category',
            data: y_data,
            // y轴在grid中的分割线
            splitLine: {
                show: false,
            },
            // y轴坐标label文本设置
            axisLabel: {
                // 距离顶部20
                padding: [0, 10, 0, 0],
                color: '#495060'
            },
            // y坐标轴线是否显示
            axisLine: {
                show:true,
                lineStyle:{
                    color:'#EEEEEE'
                }
            },
            // y轴刻度是否显示
            axisTick: {
                show:true
            }
        },
        series: data_arr
    };
}

export default barXChart2