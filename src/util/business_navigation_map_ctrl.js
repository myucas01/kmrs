/**
 * 此文件只针对商机导航页面，可基于map.js二次封装
 */
import MapCtrl from './map.js'

let MapCtrl = {
    /*--------------------------GEO数据结构地图操作------------------------*/
    /**
     * @description 增加点标记
     * @param {object} map_obj 地图实例
     * @param {Array<object>} marker_array 点标记对象数组
     */









    /*--------------------------非GEO数据结构地图------------------------*/
    /**
     * @description 创建某个marker对象工厂函数(分为三种：1、纯粹一个图标,2、自定义)
     * @param {number} pointType marker类型
     */
    markerFactory: (pointType, div_content) => {
        if (pointType === 1) {
            return {
                position: new AMap.LngLat(116.39, 39.9),
                offset: new AMap.Pixel(0, 0),
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
                anchor: 'center'
            }
        } else if (pointType === 2) {
            return {
                position: new AMap.LngLat(116.39, 39.9),
                offset: new AMap.Pixel(0, 0),
                content: div_content,
                anchor: 'bottom-center'
            }
        }
    },
    /**
     * @description 聚焦在某点
     * @param {object} map_obj 地图实例
     * @param {object} marker 某点对象
     */
    locateMarker: (map_obj, marker) => {

    },

    /**
     * @description 增加点标记
     * @param {object} map_obj 地图实例
     * @param {Array<object>} marker_array 点标记对象数组
     */
    addMarker: (map_obj, marker_array) => {
        if (map_obj) {
            map_obj.add(marker_array)
        } else {
            console.error('请先初始化地图对象！')
        }
    },

    /**
     * @description 增加海量点标记（成千上万+）
     * @param {object} map_obj 地图实例
     * @param {object} mass_marker_obj 海量点标记对象
     * @param {Array<object> || object} style_array 海量点标记样式
     * @param {Array<object>} marker_array 点标记对象
     */
    addMassMarker: (map_obj, mass_marker_obj, style_array, marker_array) => {
        // 设置样式
        mass_marker_obj.setStyle(style_array)
        // 设置数据
        mass_marker_obj.setData(marker_array)
        // 将点注入地图对象
        massMarks.setMap(map_obj)
    },

    /**
     * @description 增加矢量线标记
     * @param {object} map_obj 地图实例
     * @param {Array<object>} path_array 线标记对象
     */
    addLine: (map_obj, path_obj) => {
        if (map_obj && path_obj.path) {
            let polyline = new AMap.Polyline(Object.assign({
                    // 线上面的点坐标数组对象
                    path: '',
                    // 线条宽度
                    borderWeight: 3,
                    // 线条颜色
                    strokeColor: '#5085e2',
                    // 折线拐点连接处样式
                    lineJoin: 'round',
                    // 层级，后添加的在上面，除非设置zIndex级别
                    zIndex: 1
                },
                path_obj
            ));
            map_obj.add(polyline)
            return polyline
        } else {
            console.error('增加矢量线标记报错！')
        }
    },

    /**
     * @description 增加多边形区域
     * @param {object} map_obj 地图实例
     * @param {object} area_obj 多边形区域对象
     */
    addArea: (map_obj, area_obj) => {
        if (map_obj && area_obj.path) {
            let polygon = new AMap.Polygon(Object.assign({
                    // 线上面的点坐标数组对象
                    path: '',
                    // 填充颜色
                    fillColor: '#ffffff',
                    // 填充区透明度
                    fillOpacity: 0.9,
                    // 边缘线条宽度
                    strokeWeight: 1,
                    // 边缘线颜色
                    strokeColor: '#ffffff',
                    // 边缘线形状-实线
                    strokeStyle: 'solid'

                },
                area_obj
            ));
            map_obj.add(polygon)
            return polygon
        } else {
            console.error('增加多边形区域报错！')
        }
    },

    /**
     * @description 增加圆形区域
     * @param {object} map_obj 地图实例
     * @param {object} circle_obj 圆形区域对象
     */
    addCircle: (map_obj, circle_obj) => {
        if (map_obj && area_obj.path) {
            let circle = new AMap.Circle(Object.assign({
                    // 圆心位置
                    center: '',
                    // 圆半径
                    radius: '1000',
                    // 圆形填充颜色
                    fillColor: '#ffffff',
                    // 描边颜色
                    strokeColor: '#ffffff',
                    // 描边宽度
                    strokeWeight: 1,
                    // 描边样式
                    strokeStyle: solid
                },
                circle_obj
            ));
            map_obj.add(circle)
            return circle
        } else {
            console.error('增加圆形区域报错！')
        }
    },

    /**
     * @description 增加群组区域
     * @param {object} map_obj 地图实例
     * @param {object} data 群组区域对象
     */
    addAreas: (map_obj, data) => {

    },

    /**
     * @description 移除某个点标记
     * @param {object} map_obj 地图实例
     * @param {object} data 点标记对象
     */
    deleteMarker: (map_obj, data) => {

    },

    /**
     * @description 移除某个区域
     * @param {object} map_obj 地图实例
     * @param {object} data 地域对象
     */
    deleteArea: (map_obj, data) => {

    },

    /**
     * @description 移除群组区域
     * @param {object} map_obj 地图实例
     * @param {object} data 群组区域对象
     */
    deleteAreas: (map_obj, data) => {

    },

    /**
     * @description 清除所有标记
     * @param {object} map_obj 地图实例
     * @param {object} data 所有标记对象
     */
    deleteAllMapMarkers: (map_obj, data) => {

    },

    /**
     * @description 清除地图实例，释放内存
     * @param {object} map_obj 地图实例
     */
    deleteMapObj: (map_obj) => {

    }
}

export default MapCtrl