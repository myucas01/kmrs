// import * as filtersFun from '@/util/filters.js'
function barXStackedChart(legend = [], y_data = [], data = [], is_general) {
    // 组装数据
    let data_arr = []
    for(let i = 0, length = data.length;i < length; i++){
        let obj = {
            name: data[i].name,
            type: 'bar',
            stack: 'total',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            },
            // bar间距
            barCategoryGap : is_general ? '8%':'40%',
            barMinHeight:24,
            label: {
                show: true,
                position: i === 0 ? 'insideLeft' : 'insideRight',
                distance:5,
                fontSize: 12,
                color: i === 0 ? '#ffffff' : '#333333',
                formatter: (param) => {
                    return param.data + '%'
                }
            },
            data: data[i].data
        }
        data_arr.push(obj)
    }
    return {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'transparent',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(data) {
                return (
                    '<div style="background-color:#ffffff;padding:6px; border-radius:4px;border:1px solid #930CEA;font-size:12px;color:#333333">' +
                        '<div style="font-weight:bold">' + data[0].name + '</div>' +
                        '<div style="">' + data[0].seriesName + '：' + data[0].value + '%</div>'+
                        '<div style="">' + data[1].seriesName + '：' + data[1].value + '%</div>'+
                    '</div>'
                )
            }
        },
        color:['#FAB8FF','#866CED'],
        legend: {
            show: is_general,
            data: legend,
            top:10
        },
        grid: {
            left: is_general ? '5%' : '2%',
            right:'2%',
            bottom: is_general ? '0%' : '6%',
            top: is_general ? '70%' : '6%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            max: 100,
            // x坐标轴线是否显示
            axisLine: {
                show:false
            },
            // x坐标轴刻度名是否显示
            axisLabel: {
                show:false
            },
            // x轴在grid中的分割线
            splitLine: {
                show: false
            },
            // x轴刻度是否显示
            axisTick: {
                show:false
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
                color: '#495060',
                width:250,
            },
            // y坐标轴线是否显示
            axisLine: {
                show:false
            },
            // y轴刻度是否显示
            axisTick: {
                show: false
            }
        },
        series: data_arr
    }
}

export default barXStackedChart