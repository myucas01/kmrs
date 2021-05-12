import * as filtersFun from '@/util/filters.js'
function mapChart(map_data = []) {
    return {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'transparent',
            formatter(data) {
                if(data.data) {
                    let html_str = '<div style="background-color:#ffffff;padding:6px; border-radius:4px;border:1px solid #930CEA;font-size:12px;color:#333333">' +
                                    '<div><span style="width:9px;height:9px;display:inline-block;background-color:rgba(147, 12, 234, 1);border-radius:50%"></span> ' + data.data.type + '</div>'
                    for(let i = 0, length = data.data.children.length; i < length; i++) {
                        html_str += '<div><span style="width:6px;height:6px;display:inline-block;background-color:rgba(147, 12, 234, 1);transform:rotate(45deg)"></span> ' + data.data.children[i].city + '</div>' +
                                    '<div>整体场次为：' + filtersFun.numFormat(data.data.children[i].num) + '</div>' +
                                    '<div>数据库位置：' + filtersFun.numFormat(data.data.children[i].percent) + '%</div>'
                    }
                    html_str += '</div>'
                    return html_str
                }
            }
        },
        // 左边的图例范围，以及手柄
        visualMap: {
            // 最大值最小值
            min: 0,
            max: 100,
            // 图例文本
            text: ['', map_data[0].type],
            // 是否实时显示
            realtime: true,
            // 是否显示手柄
            calculable: true,
            // 颜色范围
            inRange: {
                color: ['#6DD400', '#FFEA6C', '#FA6400']
            },
            // 宽高
            itemWidth: 40,
            itemHeight:200,
            // 距离左侧
            left:200,
            // 距离顶部
            top: 50,
            hoverLink: false
        },
        series: [
            {
                name: '中国数据',
                type: 'map',
                mapType: 'CHINA', // 自定义扩展图表类型
                label: {
                    show: false
                },
                top:10,
                bottom:10,
                data: map_data
            }
        ]
    };
}

export default mapChart