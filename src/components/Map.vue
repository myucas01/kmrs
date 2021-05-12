<template>
  <div id="map-body">
    <div id="container"></div>
    <MapTopOperate v-if="mapSearchIcon"></MapTopOperate>
    <MapSearch v-if="mapSearch"
               :AMap="AMap"
               :map_obj="map_obj"></MapSearch>
    <Organization v-if="mapOrganization"></Organization>
  </div>
</template>
<script>
/* eslint-disable */
import { AMap } from '@/plugins/AMap'
import MapTopOperate from '@/components/MapTopOperate'
import MapSearch from '@/components/MapSearch'
import Organization from '@/components/Organization'
import { mapGetters } from 'vuex'
export default {
  name: 'Map',
  components: {
    MapTopOperate,
    MapSearch,
    Organization
  },
  data() {
    return {
      AMap,
      organizeBoundariesData: {},
      map_ranging: {},
      map_obj: '',
      cluster: ''
    }
  },
  computed: {
    ...mapGetters('map', [
      'mapStyle',
      'mapHidden',
      'mapSearch',
      'mapSearchIcon',
      'mapRanging',
      'mapScale',
      'mapOrganization'
    ])
  },
  watch: {
    // 地图风格
    mapStyle(val) {
      this.map_obj.setMapStyle(val)
    },
    // 地图测距
    mapRanging(val) {
      if (val == 'open') {
        this.mapRangingTool()
      } else {
        if (this.map_ranging) {
          this.map_ranging.turnOff()
        }
      }
    },
    // 地图比例尺
    mapScale(val) {
      if (val) {
        this.mapScaleTool()
      }
    },
    // 地图常规元素
    mapHidden(val) {
      if (val) {
        this.map_obj.setFeatures([])
      } else {
        this.map_obj.setFeatures(['bg', 'road', 'point'])
      }
    }
  },
  props: ['organize_id', 'setMapStyle'],
  beforeMount() { },
  mounted() {
    this.init()
    this.mapScaleTool() // 比例尺
  },
  methods: {
    init(lng = 102.488269, lat = 37.046516) {
      this.map_obj = new AMap.Map('container', {
        zoom: 4,
        center: [lng, lat],
        resizeEnable: true
      })
      console.log('地图初始化完毕')
      this.$emit('sendMapObj', this.map_obj, AMap)
    },
    organizeBoundaries() {
      this.$fetch
        .get('/api/v1/zone-construction/layer/organize-boundaries', {
          organize_id: '7434299577672620146'
        })
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.organizeBoundariesData = res.data
            this.init(
              this.organizeBoundariesData[0].gdLng,
              this.organizeBoundariesData[0].gdLat
            )
          }
        })
    },
    /**
     * @description 绘制多个边界(其实是一个无色透明有边线的polygon)(基于GEO-JSON标准格式)
     * @param {object} options 边界数据
     */
    drawBorders(options) {
      let _this = this
      // 如果没有数据则终止运行
      if (!options.data) {
        console.warn('/** 没有拿到--绘制边界数据-- **/')
        return
      }
      // 初始化绘制边界元数据，最后返回
      const source_data = {
        // GeoJson数据和区域id构成的数据
        borderPolygonArr: [],
        // 边界区域数组
        PolygonArr: []
      }
      // 默认配置
      const defaultOption = {
        // 覆盖物层级，后面的覆盖前面的，默认10
        zIndex: 10,
        // 边界的透明度，范围(0,1)
        strokeOpacity: 1,
        // 边界颜色
        strokeColor: '#fff',
        // 边界宽度，单位像素
        strokeWeight: 1,
        // 边界样式：虚线,实线,dashed || solid
        strokeStyle: 'solid',
        // 区域透明度，范围(0,1)
        fillOpacity: '',
        // 区域填充颜色
        fillColor: '',
        // 鼠标悬停样式
        cursor: 'pointer',
        // 是否将操作冒泡到地图上
        bubble: true,
        // 区域是否可拖拽
        draggable: false
      }
      let length = options.data.length
      for (let i = 0; i < length; i++) {
        ; (function (t) {
          let polygon = '',
            polyline = '',
            gdGeom = ''
          // 获取某一个数据
          const info = options.data[t]
          // 合并配置项(对象字面量会自动将下面的同字段覆盖)
          const option = {
            ...defaultOption,
            strokeColor: info.borderColor,
            strokeOpacity: info.borderColorOpacity,
            strokeWeight: info.borderWidth,
            ...options
          }
          // 获取GeoJSON数据并转化为对象
          gdGeom = JSON.parse(info.gdBoundarJson)
          // 实例化一个高德GeoJSON对象
          const geojson = new AMap.GeoJSON({
            geoJSON: gdGeom,
            getPolygon(geojson_data, lnglats) {
              // console.log('拿到的geo-json数据', geojson_data)
              // 实例化一个区域覆盖物对象
              polygon = new AMap.Polygon({
                // 经纬度数组
                path: lnglats,
                // 边界透明度
                strokeOpacity: option.strokeOpacity,
                // 边界颜色
                strokeColor: option.strokeColor,
                // 边界宽度
                strokeWeight: option.strokeWeight,
                // 边界样式：虚线,实线,dashed || solid
                strokeStyle: option.strokeStyle,
                // 区域透明度，范围(0,1)
                fillOpacity: option.fillOpacity,
                // 区域填充颜色
                fillColor: option.fillColor,
                // 层级
                zIndex: option.zIndex,
                // 是否将操作冒泡到地图上
                bubble: option.bubble,
                // 鼠标悬停样式
                cursor: option.cursor
              })
              // 如果有回调函数，注入当下的区域覆盖物对象
              if (options.callBack) {
                options.callBack(polygon, info)
              }
              //
              // source_data.PolygonArr.push(polygon)
              source_data.PolygonArr.push(polygon)
              return polygon
            },
            getPolyline(geojson_data, lnglats) {
              // console.log('拿到的geo-json数据', geojson_data)
              // 实例化一个区域覆盖物对象
              polyline = new AMap.Polyline({
                // 经纬度数组
                path: lnglats,
                // 边界透明度
                strokeOpacity: option.strokeOpacity,
                // 边界颜色
                strokeColor: option.strokeColor,
                // 边界宽度
                strokeWeight: option.strokeWeight,
                // 边界样式：虚线,实线,dashed || solid
                strokeStyle: option.strokeStyle,
                // 区域透明度，范围(0,1)
                fillOpacity: option.fillOpacity,
                // 区域填充颜色
                fillColor: option.fillColor,
                // 层级
                zIndex: option.zIndex,
                // 是否将操作冒泡到地图上
                bubble: option.bubble,
                // 鼠标悬停样式
                cursor: option.cursor
              })
              // 如果有回调函数，注入当下的区域覆盖物对象
              if (options.callBack) {
                options.callBack(polyline, info)
              }
              //
              // source_data.PolygonArr.push(polygon)
              source_data.PolygonArr.push(polyline)
              return polyline
            }
          })
          const eventMap = {
            geojson,
            id: info.id
          }
          source_data.borderPolygonArr.push(eventMap)
          // 将Geo-json对象画到地图上
          geojson.setMap(_this.map_obj)
        })(i)
      }
      return source_data
    },
    /**
     * @description 绘制多个名称(使用高德 Text类，此类继承自Marker)
     * @param {object} options 名称数据
     */
    drawNames(options) {
      let _this = this
      if (!options.data) {
        console.warn('/** 没有拿到--绘制名称--数据 **/')
        return
      }
      // 地图Text类数组
      const nameArr = []
      const defaultOption = {
        draggable: false,
        cursor: 'pointer',
        angle: 0,
        zIndex: 900,
        title: '',
        clickable: true,
        nameKey: 'name',
        prefisso: '',
        bubble: true,
        offset: new window.AMap.Pixel(-13, -15)
      }
      const option = {
        ...defaultOption,
        ...options
      }
      let length = options.data.length
      for (let i = 0; i < length; i++) {
        if (
          options.data[i].gdLng ||
          options.data[i].storeLng ||
          options.data[i].storeAgencyLng
        ) {
          ; (function (t) {
            const eventMap = {}
            const info = options.data[t]
            let name = `${option.prefisso}${info[option.nameKey]}`
            if (!name) {
              name = info.tradeareaName
            }
            let textCenter
            if (info.storeLng && !info.gdLng) {
              textCenter = [info.storeLng, info.storeLat]
              info.id = info.storeId
              option.style = info.style
            } else if (info.storeAgencyLng && !info.gdLng) {
              textCenter = [info.storeAgencyLng, info.storeAgencyLat]
              info.id = info.agencyCode
              option.style = options.style
            } else if (info.gdLng) {
              textCenter = [info.gdLng, info.gdLat]
            }
            const map_text_obj = new AMap.Text({
              text: name,
              title: name,
              anchor: 'center',
              position: textCenter,
              draggable: option.draggable,
              cursor: option.cursor,
              angle: option.angle,
              style: option.style,
              zIndex: option.zIndex,
              offset: option.offset,
              extData: info
            })
            if (option.callBack) {
              option.callBack(map_text_obj, info)
            }
            info.DrawType = 'name'
            eventMap.id = info.id
            eventMap.text = map_text_obj
            nameArr.push(eventMap)
            map_text_obj.setMap(_this.map_obj)
          })(i)
        }
      }
      return nameArr
    },
    /**
     * @description 绘制多个图标(使用高德 Icon类 => Marker类)
     * @param {object} options 图标数据
     */
    drawIcons(options) {
      const _this = this
      if (!options.data) {
        console.warn('/** 没有拿到--绘制多个图标--数据 **/')
        return
      }
      const iconList = []
      const defaultOption = {
        // 图片大小(相当于容器)
        size: new AMap.Size(102, 96),
        // 图片尺寸(相当于background-size)
        imageSize: new AMap.Size(34, 32),
        // 图片在容器的偏移
        offset: new window.AMap.Pixel(-13, 5),
        bubble: true,
        zIndex: 10
      }
      const option = {
        ...defaultOption,
        ...options
      }
      let length = options.data.length
      // 这个值还不确定
      for (let i = 0; i < length; i++) {
        ; (function (t) {
          const info = options.data[t]
          const textCenter = [info.gdLng, info.gdLat]
          const eventMap = {}
          let img = ''
          if (!info.iconType) {
            info.iconType = '1'
          } else {
            info.iconType = info.iconType.toString()
          }
          if (info.iconType === '1') {
            img = '/img/selectIcon1.png'
          } else if (info.iconType === '2') {
            img = '/img/selectIcon2.png'
          } else if (info.iconType === '3') {
            img = '/img/selectIcon3.png'
          } else if (info.iconType === '4') {
            img = '/img/selectIcon4.png'
          } else if (info.iconType === '5') {
            img = '/img/selectIcon5.png'
          } else if (info.iconType === '6') {
            img = '/img/selectIcon6.png'
          }
          const obtainOptions = {
            iconUrl: img,
            ...option
          }
          const icon = new AMap.Icon({
            // 图标尺寸
            size: obtainOptions.size,
            // 图标的取图地址
            image: obtainOptions.iconUrl,
            // 图标所用图片大小(相当于background-size)
            imageSize: obtainOptions.imageSize
          })

          const map_marker_obj = new AMap.Marker({
            icon,
            position: textCenter,
            offset: obtainOptions.offset,
            zIndex: obtainOptions.zIndex
          })
          info.DrawType = 'Icon'
          if (obtainOptions.callBack) {
            obtainOptions.callBack(map_marker_obj, info)
          }
          eventMap.id = info.id
          eventMap.marker = map_marker_obj
          iconList.push(eventMap)
          map_marker_obj.setMap(_this.map_obj)
        })(i)
      }
      return iconList
    },
    /**
     * @description 绘制多个底色(其实是polygon)(基于GEO-JSON标准格式)
     * @param {object} options 底色数据
     */
    drawColors(options) {
      let _this = this
      // 如果没有数据则终止运行
      if (!options.data) {
        console.warn('/** 没有拿到-绘制多个底色数据-- **/')
        return
      }
      const source_data = {
        backColorPolygonArr: [],
        PolygonArr: []
      }
      const defaultOption = {
        zIndex: 10,
        strokeOpacity: 1,
        strokeColor: '',
        strokeWeight: 1,
        fillOpacity: '',
        fillColor: '',
        cursor: 'pointer',
        bubble: true,
        draggable: false
      }
      let length = options.data.length
      for (let i = 0; i < length; i++) {
        ; (function (t) {
          let polygon = '',
            gdGeom = ''
          const info = options.data[t]
          info.DrawType = 'color'
          const getOptions = {
            ...defaultOption,
            fillOpacity: info.fillColorOpacity,
            fillColor: info.fillColor ? info.fillColor : info.color,
            ...options
          }
          gdGeom = JSON.parse(info.gdBoundarJson)
          const geojson = new AMap.GeoJSON({
            geoJSON: gdGeom,
            // 还可以自定义getMarker和getPolyline
            getPolygon(geojson, lnglats) {
              // console.log('拿到的geo-json数据', geojson)
              polygon = new AMap.Polygon({
                path: lnglats,
                strokeOpacity: getOptions.strokeOpacity,
                strokeColor: getOptions.strokeColor,
                strokeWeight: getOptions.strokeWeight,
                fillOpacity: getOptions.fillOpacity,
                fillColor: getOptions.fillColor,
                zIndex: getOptions.zIndex,
                bubble: getOptions.bubble,
                cursor: getOptions.cursor
              })
              if (options.callBack) {
                options.callBack(polygon, info)
              }
              source_data.PolygonArr.push(polygon)
              return polygon
            }
          })
          const eventMap = {
            geojson,
            id: info.id
          }
          source_data.backColorPolygonArr.push(eventMap)

          geojson.setMap(_this.map_obj)
        })(i)
      }
      return source_data
    },
    /**
     * @description 绘制起始/终止点
     * @param {object} options 起点/终点数据
     */
    drawStartEndMarker(options) {
      const defaultOptions = {
        startUrl: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        endUrl: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        iconUrl: '',
        bubble: true,
        offset: new AMap.Pixel(-10, -34)
      }
      if (options.type === 'start') {
        defaultOptions.iconUrl = defaultOptions.startUrl
      } else {
        defaultOptions.iconUrl = defaultOptions.endUrl
      }
      const sysOptions = {
        ...defaultOptions,
        ...options
      }
      const map_marker_obj = new AMap.Marker({
        position: options.data,
        icon: defaultOptions.iconUrl,
        offset: sysOptions.offset
      })
      map_marker_obj.setMap(this.map_obj)
      return map_marker_obj
    },
    /**
     * @description 绘制圆形覆盖物
     * @param {Object} options
     */
    dawCircleMarker(options) {
      let _this = this
      // 如果没有数据则终止运行
      if (!options) {
        console.warn('/** 没有拿到-绘制圆形数据-- **/')
        return
      }
      let CircleMarkerArr = []
      const defaultOption = {
        fillOpacity: '#999',
        bubble: true,
        fillColor: 1
      }
      for (var i = 0; i < options.length; i += 1) {
        var circleMarker = new AMap.CircleMarker({
          center: options[i].center,
          radius: 10 + Math.random() * 10, //3D视图下，CircleMarker半径不要超过64px
          strokeColor: 'white',
          strokeWeight: 1,
          strokeOpacity: 1,
          fillColor: options[i].fillColor
            ? options[i].fillColor
            : defaultOption.fillColor,
          fillOpacity: options[i].fillOpacity
            ? options[i].fillOpacity
            : defaultOption.fillOpacity,
          zIndex: 99,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
          extData: options[i]
        })
        circleMarker.setRadius(options[i].Radius)
        circleMarker.setMap(this.map_obj)
        CircleMarkerArr.push(circleMarker)
      }
      return CircleMarkerArr
    },
    /**
     * @description 绘制多边形覆盖物
     * @param {Object} options
     */
    dawMouseTool(options) {
      // 绘制多边形覆盖物
      const mouseTool = new AMap.MouseTool(this.map_obj)
      //监听draw事件可获取画好的覆盖物
      let overlays = []
      let _this = this
      function draw(type) {
        switch (type) {
          case 'polygon':
            {
              mouseTool.polygon({
                fillColor: options.color,
                fillOpacity: 0.1,
                strokeColor: options.color,
                strokeWeight: 2,
                strokeOpacity: 1,
                bubble: true
              })
            }
            break
          default:
            break
        }
      }
      draw('polygon')
      return mouseTool
    },
    /**
     * @description 绘制海量点
     * @param {Object} options
     */
    drawMassMarks(options) {
      // 如果没有数据则终止运行
      if (!options.data) {
        console.warn('/** 没有拿到--绘制海量点数据-- **/')
        return
      }
      let _this = this
      const defaultOptions = {
        opacity: 1,
        // 此处之所以是111，因为用GEOJson绘制的边界zIndex默认为100，应该是地图机制，自己设置的zIndex无效了
        // 其次，在设置每个点的样式选项时anchor值必须，而且不能是字符串（导致无法绘制出来，demo:'bottom-center'），不能是负值（导致无法绑定事件，demo:new AMap.Pixel(-12,-22)）
        zIndex: 111,
        bubble: true,
        cursor: 'pointer'
      }
      const setOptions = {
        ...defaultOptions,
        ...options
      }
      const mass_marker_obj = new AMap.MassMarks(setOptions.data, {
        opacity: setOptions.opacity,
        zIndex: setOptions.zIndex,
        cursor: setOptions.cursor,
        style: options.style
      })
      mass_marker_obj.setMap(_this.map_obj)
      return mass_marker_obj
    },
    /**
     * @description 绘制信息弹层
     * @param {Object} options
     */
    drawInfoWindow(options) {
      const defaultOptions = {
        autoMove: true,
        isCustom: true,
        offset: new AMap.Pixel(1000, -95)
      }
      const setOptions = {
        ...defaultOptions,
        ...options
      }
      const infoWindow = new AMap.InfoWindow({
        autoMove: setOptions.autoMove,
        isCustom: setOptions.isCustom,
        content: setOptions.HTMLElement,
        anchor: setOptions.anchor,
        offset: setOptions.offset,
        position: setOptions.position
      })
      infoWindow.setMap(this.map_obj)
      return infoWindow
    },
    /**
     * @description 地图搜索
     * @param {Object} options
     */
    placeSearch(options) {
      const defaultOptions = {
        pageSize: 10, // 单页显示结果条数
        pageIndex: 1, // 页码
        children: 1, // 是否按照层级展示子POI数据,默认0 children=1，展示子节点POI数据，children=0，不展示子节点数据
        city: '全国', // 兴趣点城市
        citylimit: true, // 是否强制限制在设置的城市内搜索
        map: this.map_obj, // 展现结果的地图实例
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        type:
          '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施' // 兴趣点类别，多个类别用“|”分割，如“餐饮|酒店|电影院”
      }
      const setOptions = {
        ...defaultOptions,
        ...options
      }
      // 构造地点查询类
      const placeSearch = new AMap.PlaceSearch(setOptions)

      return new Promise((resolve, reject) => {
        placeSearch.search(setOptions.keywords, (status, result) => {
          const returnResult = {
            resultData: result,
            placeSearchObj: placeSearch
          }
          if (status === 'complete') {
            resolve(returnResult)
          } else {
            reject(returnResult)
          }
        })
      })
      // 清除查询结果 -- 绘制在地图上的点
      // placeSearch.render.markerList.clear()
    },
    // 比例尺
    mapScaleTool() {
      let that = this
      that.map_obj.plugin(['AMap.Scale'], function () {
        var scale = new AMap.Scale({
          offset: new AMap.Pixel(600, 25),
          zIndex: 2
        })
        that.map_obj.addControl(scale)
      })
    },
    // 测距
    mapRangingTool() {
      var startMarkerOptions = {
        icon: new AMap.Icon({
          size: new AMap.Size(19, 31), //图标大小
          imageSize: new AMap.Size(19, 31),
          image: 'https://webapi.amap.com/theme/v1.3/markers/b/start.png'
        })
      }
      var endMarkerOptions = {
        icon: new AMap.Icon({
          size: new AMap.Size(19, 31), //图标大小
          imageSize: new AMap.Size(19, 31),
          image: 'https://webapi.amap.com/theme/v1.3/markers/b/end.png'
        }),
        offset: new AMap.Pixel(-9, -31)
      }
      var midMarkerOptions = {
        icon: new AMap.Icon({
          size: new AMap.Size(19, 31), //图标大小
          imageSize: new AMap.Size(19, 31),
          image: 'https://webapi.amap.com/theme/v1.3/markers/b/mid.png'
        }),
        offset: new AMap.Pixel(-9, -31)
      }
      var lineOptions = {
        strokeStyle: 'solid',
        strokeColor: '#FF33FF',
        strokeOpacity: 1,
        strokeWeight: 2
      }
      var rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions: midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
      }
      this.map_obj.plugin(['AMap.RangingTool'], () => {
        this.map_ranging = new AMap.RangingTool(this.map_obj, rulerOptions)
        this.map_ranging.turnOn()
      })
    },
    // 点聚合
    mapClustererTool(data = {}, markers, options = {}) {
      let _this = this
      if (this.cluster) {
        this.cluster.clearMarkers()
      }
      var isClusterArray = []
      var count = markers.length
      var _renderClusterMarker = function (context) {
        isClusterArray[isClusterArray.length] = context.count
        var factor = Math.pow(context.count / count, 1 / 18)
        var div = document.createElement('div')
        var Hue = 250
        var bgColor = 'rgba(121,9,193,1.0)'
        var fontColor = 'rgba(255,255,255,1.0)'
        var borderColor = 'rgba(193,96,255, 0.5)'
        var shadowColor = 'hsla(' + 20 + ',100%,50%,0.1)'
        div.style.backgroundColor = bgColor
        var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
        div.style.width = div.style.height = size + 'px'
        div.style.boxShadow = '0 0 1px ' + shadowColor
        div.innerHTML = context.count
        div.style.lineHeight = size + 'px'
        div.style.color = fontColor
        div.style.fontSize = '14px'
        div.style.fontWeight = 'bold'
        div.style.textAlign = 'center'
        div.style.boxSizing = 'content-box!important'
        div.style.border = 1 * (size / 4) + 'px solid ' + borderColor
        div.style.borderRadius = '50%'
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
        // context.marker.setOffset(new AMap.Pixel(-size, -size))
        context.marker.setContent(div)
      }
      addCluster(options.type, this.map_obj)
      function addCluster(tag, map) {
        if (tag == 2) {
          //完全自定义
          _this.cluster = new AMap.MarkerClusterer(map, markers, {
            gridSize: 60,
            renderClusterMarker: _renderClusterMarker,
            minClusterSize: 1,
            maxZoom: 14.7
          })
        } else if (tag == 1) {
          //自定义图标
          var sts = [
            {
              url: 'https://a.amap.com/jsapi_demos/static/images/blue.png',
              size: new AMap.Size(32, 32),
              offset: new AMap.Pixel(-16, -16)
            },
            {
              url: 'https://a.amap.com/jsapi_demos/static/images/green.png',
              size: new AMap.Size(32, 32),
              offset: new AMap.Pixel(-16, -16)
            },
            {
              url: 'https://a.amap.com/jsapi_demos/static/images/orange.png',
              size: new AMap.Size(36, 36),
              offset: new AMap.Pixel(-18, -18)
            },
            {
              url: 'https://a.amap.com/jsapi_demos/static/images/red.png',
              size: new AMap.Size(48, 48),
              offset: new AMap.Pixel(-24, -24)
            },
            {
              url: 'https://a.amap.com/jsapi_demos/static/images/darkRed.png',
              size: new AMap.Size(48, 48),
              offset: new AMap.Pixel(-24, -24)
            }
          ]
          _this.cluster = new AMap.MarkerClusterer(map, markers, {
            styles: sts,
            gridSize: 60,
            minClusterSize: 1
          })
        } else {
          //默认样式
          _this.cluster = new AMap.MarkerClusterer(map, markers, { gridSize: 80 })
        }
        _this.cluster.on('click', function (e) {
          isClusterArray = []
          setTimeout(() => {
            var isMustCluster = isClusterArray.some(item => item > 1)
            if (!isMustCluster) {
              _this.cluster.setMinClusterSize(2)
            }
          }, 500)
        })
        map.on('zoomchange', function () {
          isClusterArray = []
          setTimeout(() => {
            var isMustCluster = isClusterArray.some(item => item > 1)
            if (!isMustCluster) {
              _this.cluster.setMinClusterSize(2)
            } else {
              _this.cluster.setMinClusterSize(1)
            }
          }, 500)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#map-body {
  flex: 1;
  display: flex;
  position: relative;
}
#container {
  flex: 1;
}
::v-deep .amap-ranging-label {
  background-color: #9d74f3;
  color: #ffffff;
}
::v-deep .amap-pls-marker-tip {
  color: black;
}
::v-deep .amap-info-contentContainer {
  color: black;
}
</style>
