/**
 * @description 渲染点，线，面，折线，名称数据至地图
 * @param options 传入的源数据
 */
function getMapData(options) {
    const {
        data,
        type,
        style,
        detail
    } = options
    if (type.length > 0) {
        let newLineData = [],
            newCoverData = [],
            newNameData = [],
            newPathData = [],
            newOutLineData = [],
            newPositionData = [],
            nowDreawData = []
        type.forEach(item => {
            if (item === 'LineData') {
                //传递地图折线数据
                const LineData = {
                    data: data,
                    strokeColor: style.color,
                    strokeWeight: style.borderSize || '2',
                    strokeOpacity: style.drawingOpacity || 1,
                    fillOpacity: null,
                    fillColor: null,
                    zIndex: detail.zIndex,
                    strokeStyle: detail.strokeStyle
                }
                newLineData = [{
                        key: detail.id,
                        value: LineData
                    },
                    'LineData',
                ]
            }
            if (item === 'OutLineData') {
                //传递地图折线数据
                const OutLineData = {
                    data: data,
                    strokeColor: '#2F85E9',
                    strokeWeight: '6',
                    strokeOpacity: 1,
                    fillOpacity: null,
                    fillColor: null,
                    zIndex: 1
                }
                const CenTerLineData = {
                    data: data,
                    strokeColor: style.color,
                    strokeWeight: '2',
                    strokeOpacity: 1,
                    fillOpacity: null,
                    fillColor: null,
                }
                newOutLineData = [{
                        key: detail.id,
                        value: [OutLineData, CenTerLineData],
                        type: 'OutLineData',
                    },
                    'OutLineData',
                ]
            }

            if (item === 'CoverData') {
                //传递地图面数据
                const CoverData = {
                    data: data,
                    fillOpacity: style.opacity || detail.fillOpacity || 0.2,
                    fillColor: style.fillcolor?style.fillcolor:style.color,
                    zIndex: detail.zIndex,
                }
                newCoverData = [{
                        key: detail.id,
                        value: CoverData
                    },
                    'CoverData',
                ]
            }
            if (item === 'NameData') {
                // 设置区域标识名称的样式
                data[0].name = detail.name
                const style = {
                    'background-color': 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    border: 'none'
                }
                const NameData = {
                    data,
                    style
                }
                newNameData = [{
                        key: detail.id,
                        value: NameData
                    },
                    'NameData',
                ]
            }
            if (item === 'PathData') {
                // 设置区域标识名称的样式
                let pathColor
                data.forEach(item => {
                    const {
                        serviceDay,
                        name,
                        routeId,
                        gdBoundarJson
                    } = item
                    switch (item.serviceDay) {
                        case '1':
                            pathColor = '#C50404'
                            break
                        case '2':
                            pathColor = '#2716C4'
                            break
                        case '3':
                            pathColor = '#4C8C06'
                            break
                        case '4':
                            pathColor = '#4A90E2'
                            break
                        case '5':
                            pathColor = '#007D86'
                            break
                        case '6':
                            pathColor = '#83562E'
                            break
                        case '7':
                            pathColor = '#D0A052'
                            break
                        default:
                            break
                    }
                    item.strokeColor = pathColor,
                        item.strokeWeight = '3',
                        item.strokeOpacity = 1,
                        item.fillOpacity = 1,
                        item.fillColor = pathColor,
                        item.zIndex = 1,
                        item.type = 'region',
                        item.data = [{
                            serviceDay,
                            name,
                            routeId,
                            gdBoundarJson
                        }]
                })
                newPathData = [{
                        key: detail.id,
                        value: data,
                    },
                    'PathData',
                ]
            }
            if (item === 'PositionData') {
                // 设置区域标识名称的样式
                const {
                    gdLat,
                    gdLng
                } = data[0]
                const PositionData = {
                    gdLng,
                    gdLat,
                }
                newPositionData = [{
                        key: detail.id,
                        value: PositionData
                    },
                    'PositionData',
                ]
            }
            if (item === 'nowDreawData') {
                // 设置区域标识名称的样式
                const OutLineData = {
                    data: data,
                    strokeColor: '#2F85E9',
                    strokeWeight: '6',
                    strokeOpacity: 1,
                    fillOpacity: null,
                    fillColor: null,
                    zIndex: 1
                }
                const CenTerLineData = {
                    data: data,
                    strokeColor: style.color,
                    strokeWeight: '2',
                    strokeOpacity: 1,
                    fillOpacity: 0.2,
                    fillColor: style.color,
                    zIndex: 2
                }
                nowDreawData = [{
                        key: detail.id,
                        value: [OutLineData, CenTerLineData],
                        type: 'nowDreawData',
                    },
                    'nowDreawData',
                ]
            }
        })
        return {
            newLineData,
            newCoverData,
            newNameData,
            newPathData,
            newOutLineData,
            newPositionData,
            nowDreawData
        }
    }
}
export default getMapData;