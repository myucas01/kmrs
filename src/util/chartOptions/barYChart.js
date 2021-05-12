// import * as filtersFun from '@/util/filters.js'
function barYChart(x_data = [], data = [], is_percent = true) {
    let data_arr = []
    for(let i = 0, length = data.length;i < length; i++){
        let obj = {
            // 每个类目的子类目
            name: data[i].name,
            type: 'bar',
            // bar宽度
            barWidth :20,
            barGap:'0%',
            // 每个柱的值样式，位置
            label: {
                show: true,
                position: 'top',
                fontSize: 10,
                color: '#656565',
                formatter: (param) => {
                    if(is_percent) {
                        return param.data + '%'
                    }
                    return param.data
                }
            },
            data: data[i].data
        }
        data_arr.push(obj)
    }
    return {
        color:['#866CED','#FAB8FF'],
        tooltip: {
            show:false,
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            bottom: '3%',
            right:'10%',
            containLabel: true
        },
        xAxis: {
            name:'区域',
            nameTextStyle:{
                color:'#A3A3A3'
            },
            type: 'category',
            data: x_data,
            // y坐标轴线是否显示
            axisLine: {
                show:false
            },
            // y轴刻度是否显示
            axisTick: {
                show:false
            }
        },
        yAxis: {
            name:'喜好度',
            nameTextStyle:{
                color:'#A3A3A3'
            },
            type: 'value',
            min: is_percent ? 0 : 1,
            max: is_percent ? 100 : 6,
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
        series: data_arr
    };
}

export default barYChart