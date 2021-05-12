<template>
  <div class="map-search">
    <div class="s-title">
      <span>搜索</span>
      <span class="el-icon-close" @click="closeMapSearch()"></span>
    </div>
    <div class="s-content">
      <el-tabs v-model="typeData" @tab-click="handleClick">
        <el-tab-pane
          label="地图搜索"
          name="mapTab"
          v-if="searchType.indexOf('map') >= 0"
        >
          <div class="tip2" v-if="cityObj.citycode">
            搜索范围: {{ cityObj.province }}
          </div>
          <div class="tip1" v-else>
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#iconicon_screen"></use></svg
            >&nbsp;&nbsp; 请拖拽至城市......
          </div>
          <div>
            <el-input
              v-model="addressName"
              placeholder="搜索道路,POI  <<enter搜索>>"
              suffix-icon="el-icon-search"
              clearable
              @keyup.enter.native="searchAddress"
              @clear="clearAddress"
              class="kmrs_input_deep"
            ></el-input>
          </div>
          <div class="s-address">
            <el-collapse v-if="mapData.length > 0">
              <el-collapse-item
                v-for="(item, index) in mapData"
                :title="`${index + 1}-${item.name}`"
                :key="index"
              >
                <p>名称：{{ item.name }}</p>
                <p>
                  地址：{{ item.pname }} - {{ item.cityname }} -
                  {{ item.adname }} - {{ item.address }}
                </p>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="s-bottom" v-if="mapData.length > 0">
            <el-pagination
              small
              layout="prev, next"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="门店搜索"
          name="storeTab"
          v-if="searchType.indexOf('org') >= 0"
          v-model="adminStoreData"
        >
          <div class="tip1" v-show="adminStoreData == 'administrative'">
            <span v-if="organizationId">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconicon_map_control"></use></svg
              >&nbsp;&nbsp; {{ organizationName }}</span
            >
            <span v-else>*无组织</span>
          </div>
          <div>
            <el-input
              v-show="adminStoreData == 'administrative'"
              v-model="storeParams.storeNameCode"
              placeholder="请输入 门店编号/门店名称"
              suffix-icon="el-icon-search"
              clearable
              class="kmrs_input_deep"
              @keyup.enter.native="searchOrgAllStore"
              @clear="clearOrgAllStore"
            ></el-input>
          </div>
          <div class="s-address">
            <el-collapse
              accordion
              v-if="storeData.length > 0"
              @change="handleChange"
              v-model="storeParams.storeCodeId"
            >
              <el-collapse-item
                v-for="(item, index) in storeData"
                :title="`${index + 1}-${item.storeName.substring(0, 15)}`"
                :key="index"
                :name="`${item.storeId}`"
              >
                <p>名称：{{ item.storeName }}</p>
                <p>地址：{{ item.storeAddress }}</p>
              </el-collapse-item>
            </el-collapse>
          </div>
          <!-- <div>
						<div class="tip1" v-show="adminStoreData == 'administrative'">
							<span v-if="storeParams.regionName">{{ storeParams.regionName }}</span>
							<span v-else>*请选择行政边界</span>
						</div>
						<div class="tip1" v-show="adminStoreData == 'organizational'">
							<span v-if="orgParams.orgName">{{ orgParams.orgName }}</span>
							<span v-else>*请选择组织边界</span>
						</div>
						<el-input v-show="adminStoreData == 'administrative'" v-model="storeParams.storeNameCode" placeholder="请输入 门店编号/门店名称"
						suffix-icon="el-icon-search" clearable class="kmrs_input_deep" @keyup.enter.native="searchAdminStore" @clear="clearStore"></el-input>
						<el-input v-show="adminStoreData == 'organizational'" v-model="orgParams.storeNameCode" placeholder="请输入门店名称"
						suffix-icon="el-icon-search" clearable class="kmrs_input_deep" @keyup.enter.native="searchOrgStore" @clear="clearStore"></el-input>
					</div> -->
          <!-- <el-tabs v-model="adminStoreData">
						<el-tab-pane label="行政边界" name="administrative">
							<div class="s-address_admin">
								<el-tree ref="adminTreeData" :props="defaultPropsAdmin" lazy :load="loadNodeAdmin" class="kmrs_tree_deep"
								node-key="id" highlight-current @node-click="storeNodeClick"></el-tree>
							</div>
						</el-tab-pane>
						<el-tab-pane label="组织边界" name="organizational">
							<div class="s-address_admin">
								<el-tree ref="orgTreeData" :props="defaultPropsOrg" lazy :load="loadNodeOrg" class="kmrs_tree_deep" node-key="id"
								highlight-current @node-click="orgNodeClick"></el-tree>
							</div>
						</el-tab-pane>
						<el-tab-pane label="商圈边界" name="business">
							<el-tree :data="treeData" :props="defaultProps" class="kmrs_tree_deep"></el-tree>
						</el-tab-pane>
					</el-tabs> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AMap } from '@/plugins/AMap'
export default {
  name: 'MapSearch',
  props: ['AMap', 'map_obj'],
  data() {
    return {
      mapObj: '',
      typeData: 'mapTab',
      adminStoreData: 'administrative',
      keyWord: '',
      searchData: 'administrative',
      cityObj: {
        province: '',
        city: '',
        citycode: ''
      },
      searchActualColumn: '',
      addressName: '',
      storeParams: {
        storeNameCode: '',
        storeCodeId: '',
        regionCode: '',
        regionLevel: '',
        regionName: ''
      },
      orgParams: {
        parentOrgId: '',
        storeNameCode: '',
        orgName: ''
      },
      pageSize: 15,
      pageNum: 1,
      mapData: [],
      storeData: [],
      storeDataMarkerList: new Map(),
      storeMakerList: [],
      defaultPropsAdmin: {
        label: 'regionName',
        isLeaf: 'leaf'
      },
      nameStyle: {
        border: 'none',
        'text-align': 'center',
        'font-size': '10px',
        'font-weight': '400',
        color: '#ffffff',
        background: 'transparent',
        'font-family': 'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei'
      },
      defaultPropsOrg: {
        label: 'orgName',
        isLeaf: 'leaf'
      },
      GaStoreTxt: '',
      GaStoreMarks: ''
    }
  },
  computed: {
    ...mapGetters('map', ['searchType', 'organizationId', 'organizationName'])
  },
  created() {},
  mounted() {
    this.mapDragend()
  },
  methods: {
    handleChange() {
      let _this = this
      let marker = _this.storeDataMarkerList.get(this.storeParams.storeCodeId)
      // marker.setAnimation('AMAP_ANIMATION_DROP');
      _this.map_obj.setFitView(marker)
    },
    // 地图移动
    mapDragend() {
      let _this = this
      _this.map_obj.on('dragend', function() {
        _this.getCityCode()
      })
      // _this.map_obj.on('zoomstart', function () {
      // 	_this.getCityCode()
      // })
      // _this.map_obj.on('zoomchange', function () {
      // 	_this.getCityCode()
      // })
      // _this.map_obj.on('zoomend', function () {
      // 	_this.getCityCode()
      // })
    },
    getCityCode() {
      let _this = this
      _this.map_obj.getCity(function(info) {
        if (info.citycode) {
          _this.cityObj = info
        } else {
          _this.cityObj = {
            province: '',
            city: '',
            citycode: ''
          }
        }
      })
    },
    // 地图门店搜索
    async searchAddress() {
      let _this = this
      _this.clearAddress()
      if (_this.cityObj.citycode && _this.addressName) {
        let result = await _this.$parent.placeSearch({
          keywords: _this.addressName,
          pageSize: _this.pageSize,
          pageIndex: _this.pageNum,
          city: _this.cityObj.citycode,
          type:
            '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
        })
        _this.mapData = result.resultData.poiList.pois
        _this.mapData.forEach(item => {
          if (item.name.length > 18) {
            item.name = item.name.substring(0, 10) + '...'
          }
        })
        _this.searchActualColumn = result.placeSearchObj
      }
    },
    // 清空地图搜索
    clearAddress() {
      let _this = this
      _this.mapData = []
      if (_this.searchActualColumn) {
        _this.searchActualColumn.render.markerList.clear()
      }
    },
    // 查询指定组织下的门店
    async searchOrgAllStore() {
      let _this = this
      _this.clearOrgAllStore()
      if (_this.organizationId && _this.storeParams.storeNameCode) {
        console.log('查询指定组织门店')
        let url = '/api/route/all/global/store'
        _this.$fetch
          .get(url, {
            codeOrName: _this.storeParams.storeNameCode,
            orgId: _this.organizationId
          })
          .then(res => {
            if (res.code == 200) {
              if (res.data.length > 0) {
                _this.drawOrgStore(res.data, res.data.length)
              }
            }
          })
      }
    },
    drawOrgStore(data, lng) {
      let _this = this
      for (let item of data) {
        if (item.storeLng && item.storeLat) {
          _this.storeData.push(item)
          let marker = new AMap.Marker({
            icon: new AMap.Icon({
              image:
                '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
              size: new AMap.Size(22, 28), //图标所处区域大小
              imageSize: new AMap.Size(22, 28) //图标大小
            }),
            position: [item.storeLng, item.storeLat],
            // anchor: 'bottom-center',
            offset: new AMap.Pixel(-11, -30)
          })
          if (lng == 1) {
            _this.map_obj.setFitView(marker)
          }
          marker.setMap(_this.map_obj)
          _this.storeDataMarkerList.set(item.storeId, marker)
        }
      }
    },
    // 清空指定组织下的门店
    clearOrgAllStore() {
      let _this = this
      _this.$set(_this, 'storeData', [])
      if (_this.storeDataMarkerList.size > 0) {
        for (let item of _this.storeDataMarkerList) {
          item[1].setMap(null)
        }
        _this.storeDataMarkerList = new Map()
      }
    },
    // 行政门店搜索
    async searchAdminStore() {
      let _this = this
      _this.clearStore()
      if (_this.storeParams.regionCode && _this.storeParams.regionLevel) {
        let url = '/api/bn/store/position/getStoreByRegion'
        _this.$fetch
          .get(url, {
            storeNameCode: _this.storeParams.storeNameCode,
            regionCode: _this.storeParams.regionCode,
            regionLevel: _this.storeParams.regionLevel
          })
          .then(res => {
            if (res.code == 200) {
              _this.drawMaker(res.data)
            }
          })
      }
    },
    // 行政点击
    storeNodeClick(data, node) {
      this.$refs.adminTreeData.setCurrentKey(node.id)
      this.storeParams.regionCode = node.data.regionCode
      this.storeParams.regionLevel = node.data.regionLevel
      this.storeParams.regionName = node.data.regionName
    },
    // 行政组织树搜索
    loadNodeAdmin(node, resolve) {
      let _this = this
      let code = ''
      let url = '/api/bn/store/position/getRegionList'

      if (node.level == 0 && !node.data) {
        code = ''
      } else {
        code = node.data.regionCode
      }

      setTimeout(() => {
        _this.$fetch
          .get(url, {
            regionParentCode: code
          })
          .then(res => {
            return resolve(res.data)
          })
      }, 500)
    },

    // 组织树点击
    orgNodeClick(data, node) {
      this.$refs.orgTreeData.setCurrentKey(node.id)
      this.orgParams.parentOrgId = node.data.orgId
      this.orgParams.orgName = node.data.orgName
    },

    // 组织树搜索
    loadNodeOrg(node, resolve) {
      let _this = this
      let code = ''
      let url = '/api/bn/store/position/getOrgList'

      if (node.level == 0 && !node.data) {
        code = ''
      } else {
        code = node.data.orgId
      }

      setTimeout(() => {
        _this.$fetch
          .get(url, {
            parentOrgId: code,
            userId: ''
          })
          .then(res => {
            return resolve(res.data)
          })
      }, 500)
    },

    // 组织门店搜索
    async searchOrgStore() {
      let _this = this
      _this.clearStore()

      if (_this.orgParams.parentOrgId && _this.orgParams.storeNameCode) {
        let url = '/api/bn/store/position/getStoreByOrg'
        _this.$fetch
          .get(url, {
            storeNameCode: _this.orgParams.storeNameCode,
            parentOrgId: _this.orgParams.parentOrgId
          })
          .then(res => {
            if (res.code == 200) {
              _this.drawMaker(res.data)
            }
          })
      }
    },

    // 清空门店搜索
    clearStore() {
      let _this = this
      if (this.GaStoreMarks && this.GaStoreTxt) {
        for (let item of this.GaStoreMarks) {
          if (item.marker) {
            _this.$parent.map_obj.remove(item.marker)
          }
        }
        for (let item of this.GaStoreTxt) {
          if (item.text) {
            _this.$parent.map_obj.remove(item.text)
          }
        }
      }
    },

    // 画门店
    async drawMaker(data) {
      let _this = this
      let makerList = []
      data.forEach(item => {
        if (item.storeGdLng && item.storeGdLat) {
          let param = {}
          param.name = '店'
          param.gdLng = item.storeGdLng
          param.gdLat = item.storeGdLat
          makerList.push(param)
        }
      })

      _this.storeMakerList = makerList

      this.GaStoreMarks = await _this.$parent.drawIcons({
        data: _this.storeMakerList,
        iconUrl: '/img/positionMap.png'
        // size: new _this.AMap.Size(19, 30),
        // imageSize: new _this.AMap.Size(19, 30),
      })

      this.$parent.map_obj.setFitView()

      this.GaStoreTxt = await _this.$parent.drawNames({
        data: _this.storeMakerList,
        style: this.nameStyle,
        offset: new _this.AMap.Pixel(3, 15)
        // offsetInfo: new _this.AMap.Pixel(0, 20)
      })
    },

    handleCurrentChange(pageNum) {
      let _this = this
      _this.pageNum = pageNum
      _this.searchAddress()
    },

    closeMapSearch() {
      let _this = this
      _this.clearAddress()
      _this.clearStore()
      _this.clearOrgAllStore()
      _this.$store.dispatch('map/setMapSearch', false)
    },

    handleClick() {}
  }
}
</script>

<style scoped lang="scss">
.map-search {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 300px;
  height: 100%;
  z-index: 2001;
  background-color: #0a2757;

  .s-title {
    color: #ffffff;
    height: 32px;
    line-height: 32px;
    padding: 0px 13px;
    background-color: #08214a;
    border: 1px solid #08214a;

    span {
      height: 32px;
      line-height: 32px;

      &:first-child {
        float: left;
      }

      &:last-child {
        font-size: 17px;
        float: right;
      }
    }
  }

  .s-content {
    height: 100%;

    .el-tabs {
      height: 100%;
      background: #0a2757;

      ::v-deep .el-tabs__item {
        color: #ffffff;
        width: 150px;
        text-align: center;
        padding: 0px;
      }

      .s-address {
        height: calc(100% - 250px);
        overflow: auto;
      }

      ::v-deep .el-tabs__item.is-active {
        color: #d595ff !important;
      }

      ::v-deep .el-tabs__content {
        height: 100%;
        color: #8199a4;
        padding: 0px 15px;

        .el-tab-pane {
          height: 100%;

          .el-tabs {
            height: 100%;

            .el-tabs__content {
              height: 100%;

              .s-address_admin {
                height: calc(100% - 200px);
                overflow: auto;
              }
            }
          }
        }

        .tip1 {
          color: #d595ff;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .tip2 {
          margin-bottom: 8px;
          font-size: 12px;
        }

        .el-input__inner {
          height: 34px;
          font-size: 12px;
        }

        .el-input__icon {
          line-height: 34px;
        }

        .el-tabs {
          margin-top: 10px;

          .el-tabs__item {
            color: #ffffff;
            width: 135px;
            text-align: center;
            border: 1px solid #ffffff;
            height: 28px;
            line-height: 28px;
          }

          .el-tabs__item.is-active {
            color: #ffffff !important;
            background-color: #930cea;
          }

          .el-tabs__active-bar {
            display: none;
          }
        }

        .storeList {
        }
      }

      ::v-deep .el-collapse {
        border-top: 0px;
        font-size: 10px;

        .el-collapse-item__header {
          background-color: #102f63;
          color: #ffffff;
          height: 34px;
          line-height: 34px;
          padding-left: 15px;
          border-bottom: 1px solid #3d4558;
          font-weight: 700;
        }

        .el-collapse-item__wrap {
          border-bottom: 1px solid #3d4558;
        }

        .el-collapse-item__content {
          background-color: #0a2757;
          color: #ffffff;
          padding: 5px;
        }
      }

      ::v-deep .el-tree {
        background-color: #0a2757;
        color: #ffffff;
        font-size: 12px;
        font-weight: 400;
        padding: 10px 0px;

        .el-tree-node.is-current > .el-tree-node__content {
          background-color: #930cea !important;
        }
      }
    }
  }

  .s-bottom {
    text-align: right;
    padding: 15px;

    ::v-deep .el-pagination .btn-prev {
      background-color: #08214a;
      border: 1px solid #08214a;
      color: #ffffff;
    }

    ::v-deep .el-pagination .btn-next {
      background-color: #08214a;
      border: 1px solid #08214a;
      color: #ffffff;
    }
  }
}
</style>
