/**
 * Geo_JSON 基本原子结构（type只有："Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", ）
 */
//let Geo_json_format_demo = {
//     "type": "Feature",
//     "geometry": {
//         "type": "Point",
//         "coordinates": [125.6, 10.1]
//     },
//     "properties": {
//         "name": "Dinagat Islands"
//     }
// }
import {AMap} from '@/plugins/AMap';

let MapCtrl = {
  /**
     * @description 绘制多个边界(其实是一个无色透明有边线的polygon)(基于GEO-JSON标准格式)
     * @param {object} map_obj 地图实例
     * @param {object} options 边界数据
     */
  drawBorders: (map_obj, options) => {
    // 如果没有数据则终止运行
    if (!options.data) {
      console.warn ('/** 没有拿到--绘制边界数据-- **/');
      return;
    }
    // 初始化绘制边界元数据，最后返回
    const source_data = {
      // GeoJson数据和区域id构成的数据
      borderPolygonArr: [],
      // 边界区域数组
      PolygonArr: [],
    };
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
      draggable: false,
    };
    let length = options.data.length;
    for (let i = 0; i < length; i++) {
      (function (t) {
        let polygon = '', gdGeom = '';
        // 获取某一个数据
        const info = options.data[t];
        // 合并配置项(对象字面量会自动将下面的同字段覆盖)
        const option = {
          ...defaultOption,
          strokeColor: info.strokeColor,
          strokeOpacity: info.strokeOpacity,
          strokeWeight: info.strokeWeight,
          ...options,
        };
        // 获取GeoJSON数据并转化为对象
        gdGeom = JSON.parse (info.gdBoundarJson);
        // console.log('拿到的gdGeom数据', gdGeom)
        // 实例化一个高德GeoJSON对象
        const geojson = new AMap.GeoJSON ({
          geoJSON: gdGeom,
          getPolygon (geojson_data, lnglats) {
            // console.log('拿到的geo-json数据', geojson_data)
            // 实例化一个区域覆盖物对象
            polygon = new AMap.Polygon ({
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
              cursor: option.cursor,
            });
            // 如果有回调函数，注入当下的区域覆盖物对象
            if (options.callBack) {
              options.callBack (polygon, info);
            }
            //
            source_data.PolygonArr.push (polygon);
            return polygon;
          },
        });
        const eventMap = {
          geojson,
          id: info.regionCode,
        };
        source_data.borderPolygonArr.push (eventMap);
        // 将Geo-json对象画到地图上
        geojson.setMap (map_obj);
      }) (i);
    }
    return source_data;
  },
  /**
     * @description 绘制多个名称(使用高德 Text类，此类继承自Marker)
     * @param {object} map_obj 地图实例
     * @param {object} options 名称数据
     */
  drawNames: (map_obj, options) => {
    if (!options.data) {
      console.warn ('/** 没有拿到--绘制名称--数据 **/');
      return;
    }
    // 地图Text类数组
    const nameArr = [];
    const defaultOption = {
      draggable: false,
      cursor: 'pointer',
      angle: 0,
      zIndex: 900,
      title: '',
      clickable: true,
      nameKey: 'name',
      prefisso: '',
    };
    const option = {
      ...defaultOption,
      ...options,
    };
    let length = options.data.length;
    for (let i = 0; i < length; i++) {
      if (options.data[i].gdLng) {
        (function (t) {
          const eventMap = {};
          const info = options.data[t];
          let name = `${option.prefisso}${info[option.nameKey]}`;
          if (!name) {
            name = info.tradeareaName;
          }
          const textCenter = [info.gdLng, info.gdLat];
          const map_text_obj = new AMap.Text ({
            text: name,
            title: name,
            anchor: 'center',
            position: textCenter,
            draggable: option.draggable,
            cursor: option.cursor,
            angle: option.angle,
            zIndex: option.zIndex,
          });
          if (option.callBack) {
            option.callBack (map_text_obj, info);
          }
          info.DrawType = 'name';
          eventMap.id = info.id;
          eventMap.text = map_text_obj;
          nameArr.push (eventMap);
          map_text_obj.setMap (map_obj);
        }) (i);
      }
    }
    return nameArr;
  },

  /**
     * @description 绘制多个图标(使用高德 Icon类 => Marker类)
     * @param {object} map_obj 地图实例
     * @param {object} options 图标数据
     */
  drawIcons: (map_obj, options) => {
    if (!options.data) {
      console.warn ('/** 没有拿到--绘制多个图标--数据 **/');
      return;
    }
    const iconList = [];
    const defaultOption = {
      // 图片大小(相当于容器)
      size: new AMap.Size (102, 96),
      // 图片尺寸(相当于background-size)
      imageSize: new AMap.Size (34, 32),
      // 图片在容器的偏移
      offset: new window.AMap.Pixel (-13, 5),
      zIndex: 10,
    };
    const option = {
      ...defaultOption,
      ...options,
    };
    let length = options.data.length;
    // 这个值还不确定
    let staticResourcesUrl = '';
    for (let i = 0; i < length; i++) {
      (function (t) {
        const info = options.data[t];
        const textCenter = [info.gdLng, info.gdLat];
        const eventMap = {};
        let img = '';
        if (!info.iconType) {
          info.iconType = '1';
        } else {
          info.iconType = info.iconType.toString ();
        }
        if (info.iconType === '1') {
          img = staticResourcesUrl + '/organizeIcon/Five-pointedStar.svg';
        } else if (info.iconType === '2') {
          img = staticResourcesUrl + '/organizeIcon/Triangle.svg';
        } else if (info.iconType === '3') {
          img = staticResourcesUrl + '/organizeIcon/diamond.svg';
        } else if (info.iconType === '4') {
          img = staticResourcesUrl + '/organizeIcon/Flag.svg';
        } else if (info.iconType === '5') {
          img = staticResourcesUrl + '/organizeIcon/Waterdrop.svg';
        } else if (info.iconType === '6') {
          img = staticResourcesUrl + '/organizeIcon/House.svg';
        } else {
          img = staticResourcesUrl + info.iconType;
        }
        const obtainOptions = {
          iconUrl: img,
          ...option,
        };
        const icon = new AMap.Icon ({
          // 图标尺寸
          size: obtainOptions.size,
          // 图标的取图地址
          image: obtainOptions.iconUrl,
          // 图标所用图片大小(相当于background-size)
          imageSize: obtainOptions.imageSize,
        });

        const map_marker_obj = new AMap.Marker ({
          icon,
          position: textCenter,
          offset: obtainOptions.offset,
          zIndex: obtainOptions.zIndex,
        });
        info.DrawType = 'Icon';
        if (obtainOptions.callBack) {
          obtainOptions.callBack (map_marker_obj, info);
        }
        eventMap.id = info.id;
        eventMap.marker = map_marker_obj;
        iconList.push (eventMap);
        map_marker_obj.setMap (map_obj);
      }) (i);
    }
    return iconList;
  },

  /**
     * @description 绘制多条路线
     * @param {object} map_obj 地图实例
     * @param {object} options 路线数据
     */

  drawLines: () => {},
  /**
     * @description 绘制多个底色(其实是polygon)(基于GEO-JSON标准格式)
     * @param {object} map_obj 地图实例
     * @param {object} options 底色数据
     */
  drawColors: (map_obj, options) => {
    // 如果没有数据则终止运行
    if (!options.data) {
      console.warn ('/** 没有拿到-绘制多个底色数据-- **/');
      return;
    }
    const source_data = {
      backColorPolygonArr: [],
      PolygonArr: [],
    };
    const defaultOption = {
      zIndex: 10,
      strokeOpacity: 1,
      strokeColor: '',
      strokeWeight: 1,
      fillOpacity: '0.5',
      fillColor: 'red',
      cursor: 'pointer',
      bubble: true,
      draggable: false,
    };
    let length = options.data.length;
    for (let i = 0; i < length; i++) {
      (function (t) {
        let polygon = '', gdGeom = '';
        const info = options.data[t];
        info.DrawType = 'color';
        const getOptions = {
          ...defaultOption,
          fillOpacity: info.fillOpacity,
          fillColor: info.fillColor ? info.fillColor : info.color,
          ...options,
        };
        gdGeom = JSON.parse (info.gdBoundarJson);
        const geojson = new AMap.GeoJSON ({
          geoJSON: gdGeom,
          // 还可以自定义getMarker和getPolyline
          getPolygon (geojson, lnglats) {
            polygon = new AMap.Polygon ({
              path: lnglats,
              strokeOpacity: getOptions.strokeOpacity,
              strokeColor: getOptions.strokeColor,
              strokeWeight: getOptions.strokeWeight,
              fillOpacity: getOptions.fillOpacity,
              fillColor: getOptions.fillColor,
              zIndex: getOptions.zIndex,
              bubble: getOptions.bubble,
              cursor: getOptions.cursor,
            });
            if (options.callBack) {
              options.callBack (polygon, info);
            }
            source_data.PolygonArr.push (polygon);
            return polygon;
          },
        });
        const eventMap = {
          geojson,
          id: info.regionCode,
        };
        source_data.backColorPolygonArr.push (eventMap);

        geojson.setMap (map_obj);
      }) (i);
    }
    return source_data;
  },

  /**
     * @description 绘制起始/终止点
     * @param {object} map_obj 地图实例
     * @param {object} options 起点/终点数据
     */
  drawStartEndMarker: (map_obj, options) => {
    const defaultOptions = {
      startUrl: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
      endUrl: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
      iconUrl: '',
      offset: new AMap.Pixel (-10, -34),
    };
    if (options.type === 'start') {
      defaultOptions.iconUrl = defaultOptions.startUrl;
    } else {
      defaultOptions.iconUrl = defaultOptions.endUrl;
    }
    const sysOptions = {
      ...defaultOptions,
      ...options,
    };
    const map_marker_obj = new AMap.Marker ({
      position: options.data,
      icon: defaultOptions.iconUrl,
      offset: sysOptions.offset,
    });
    map_marker_obj.setMap (map_obj);
    return map_marker_obj;
  },
};

export default MapCtrl;
