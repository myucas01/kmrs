// import * as filtersFun from '@/util/filters.js'
function radarChart(legend = [], indicator = [], data = []) {
    return {
        color:['#759FFA','#74DDB4'],
        tooltip: {},
        title: {
            text: '【适合度】',
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
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#A3A3A3',
                    fontSize:11,
                    width:50
                }
            },
            indicator: indicator,
            // 雷达占容器百分比半径，
            radius:'55%'
        },
        series: [{
            name: '品牌1 vs 品牌2',
            type: 'radar',
            label:{
                fontSize:18
            },
            data: data
        }]
    }
}

export default radarChart