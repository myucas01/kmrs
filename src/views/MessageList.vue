<template>
  <div class="list_box">
    <div class="tagBox">
      <span class="cursor" :class="{ active: mesType == '1' }" @click="mesTypeChange('1')"
        >业务消息 <i v-if="bussinessTotal > 0">{{ bussinessTotal }}</i></span
      >
      <span class="cursor" :class="{ active: mesType == '0' }" @click="mesTypeChange('0')"
        >系统公告<i v-if="systemTotal > 0">{{ systemTotal }}</i></span
      >
    </div>
    <!--业务消息-->
     <!-- v-if="mesType == '1'" -->
    <div class="info_box">
      <div class="tab_box">
        <div class="leftTab">
          <span
            class="tabInfo left"
            :class="{ active: listtype == '' }"
            @click="changeTab('')"
          >
            全部
          </span>
          <span
            class="tabInfo right"
            :class="{ active: listtype == '0' }"
            @click="changeTab('0')"
          >
            未读
          </span>
        </div>
      </div>
      <div class="table_box">
        <el-table
          :data="tableData"
          :show-header="false"
          @cell-mouse-enter="handleMouseEnter"
          @cell-mouse-leave="handleMouseOut"
        >
          <el-table-column>
            <template slot-scope="scope">
              <div class="flex">
                <div class="img">
                  <svg class="icon svg-icon" aria-hidden="true" v-if="scope.row.business === '划区算法' || scope.row.business === '建线算法'">
                    <use xlink:href="#iconicon_notice_huaqujianxianlei"></use>
                  </svg>
                  <svg class="icon svg-icon" aria-hidden="true" v-if="scope.row.business === '审核消息'">
                    <use xlink:href="#iconicon_notice_shenpilei"></use>
                  </svg>
                  <em v-if="scope.row.status == '0'"></em>
                </div>
                <div>
                  <p class="color_block f14">{{ scope.row.title }}</p>
                  <p
                    class="stateName color_grey f14"
                    @click="goDetail(scope.row)"
                  >
                    {{ scope.row.contents }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template slot-scope="scope">
              <p class="date">发信人</p>
              <p class="date">{{ scope.row.sendUser }}</p>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template slot-scope="scope">
              <p class="date">时间</p>
              <p class="date">{{ scope.row.createTime }}</p>
            </template>
          </el-table-column>
          <template slot="empty" v-if="mesType == '1'">
                暂无消息
          </template>
          <template slot="empty" v-else>
                暂无公告
          </template>
        </el-table>
      </div>
      <div
        class='page_Box'
      >
        <div>
          <span class="pageIndex"
            >共{{ total }}条记录 第{{ currentPage }}页/共{{
              totalPages
            }}页</span
          >
        </div>
        <div>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 100]"
            :page-size="pageSize"
            layout="prev, pager, next, sizes"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="390px"
      :modal-append-to-body="false"
    >
      <span class="dialogMes">{{ dialogMes }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'mesList',
  data() {
    return {
      dialogVisible: false,
      dialogMes: '',
      listtype: '',
      tableData: [
      ],
      tableData1: [
      ],
      mesType: '1',
      notReadTotal: 0,
      bussinessTotal: 0, //业务
      systemTotal: 0, //系统
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  props: [],
  computed: {
    totalPages() {
      if (!this.total) {
        return '1'
      }
      return Math.ceil(this.total / this.pageSize)
    }
  },
  beforeRouteEnter(to,from,next) {
    next( vm => {
      vm.$store.commit('addTabs', {
        title: '消息列表',
        link: '/message-list',
        on:true,
        needCatch: true
      })
    })
  },
  created() {
    this.getList()
  },
  methods: {
    handleMouseEnter(row, column, cell) {
      if (cell.children[0].children[0].className == 'flex') {
        row.processShow = true
      }
    },
    handleMouseOut(row, column, cell) {
      if (cell.children[0].children[0].className == 'flex') {
        row.processShow = false
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
      // this.getServiceRange()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getList()
    },
    mesTypeChange(type) {
      this.mesType = type
      this.getList()
    },
    async getList() {
      let getData = {
        operatorId: this.$cookies.get('userId'), //当前登录的USERID
        // operatorId: '5f48f07abb574d8d89f7af04a1bcd98d', //当前登录的USERID
        pageNum: this.currentPage, //页数
        pageSize: this.pageSize, //一页几条
        status: this.listtype, //已读未读,0,未读,1,已读,空全部
        type: this.mesType,//系统消息0,业务消息1
      }
       this.$fetch.get(
        '/api/route/websocket/msg',
        getData
      ).then(res => {
        // console.log(res);
      if (res.code == '200') {
        if(res.data) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.currentPage = res.data.pageNum
          this.notReadTotal = res.data.notReadTotal
          this.bussinessTotal = res.data.bussinessTotal
          this.systemTotal = res.data.systemTotal
          this.$store.commit('SET_READTOTAL', this.notReadTotal)
        }
      }
      })
    },
    changeTab(type) {
      this.listtype = type
      this.currentPage = 1
      this.getList()
    },
    openDialog(type) {
      if (type == '1') {
        this.dialogMes = '审批同意，请确认'
      } else if (type == '2') {
        this.dialogMes = '审批不同意，请确认'
      } else if (type == '3') {
        this.dialogMes = '撤回审批单，请确认'
      }
      this.dialogVisible = true
    },
    // 已读
    async goDetail(item) {
      // console.log(item)
      let messageId={messageId:item.id}
      if(item.status == '0') {
        this.$fetch.post(`/api/route/websocket/update/msg`,messageId).then( res => {
          if(res.code == '200') {
            this.getList()
          }
        })
      }
      // let _this = this
      // let result = await readed({
      //   id: item.id
      // })
      // if (result.code == '200') {
      //   this.$emit('closeMesCenterShow', '')
      //   switch (item.code) {
      //     case 301:
      //       _this.goModule(item, 'planRoute', true, 'route_planRoute')
      //       _this.getConfigDtl(item.configId)
      //       break
      //     case 302:
      //       _this.goModule(item, 'planRoute', true, 'route_planRoute')
      //       _this.getConfigDtl(item.configId)
      //       break
      //     case 303:
      //       _this.goModule(item, 'placeManualManage', true, 'route_planRoute')
      //       break
      //     case 304:
      //       _this.goModule(item, 'placeManualManage', true, 'route_placeManage')
      //       break
      //     case 306:
      //       _this.goModule(item, 'planRoute', true, 'route_placeManage')
      //       _this.getConfigDtl(item.configId)
      //       break
      //     case 307:
      //       _this.goModule(item, 'planRoute', true, 'route_placeManage')
      //       _this.getConfigDtl(item.configId)
      //       break
      //     case 312:
      //       _this.goModule(item, 'planRoute', true, 'route_planRoute')
      //       _this.getConfigDtl(item.configId)
      //       break
      //     case 313:
      //       _this.goModule(item, 'labelConfig', false,'labelConfig')
      //       break
      //     case 314:
      //       _this.goModule(item, 'labelConfig', false,'labelConfig')
      //       break
      //     default:
      //       return
      //   }
      // }

    },
    async goModule(item, type, isClick) {
      let _this = this
      if (isClick) {
        if (!_this.viewModelType) {
          // AppContext.SUITUI_['mapPanel'].isMapChoiseConditionsShow({
          //   isShow: true,
          //   paramsData: {
          //     layerCode: 'RoutePlanning',
          //     layerName: '路线规划',
          //     code: 'brp', // 权限编码
          //     layerIcon: 'static/imgs/network_planning.png',
          //     availableAreaLevel: ['country', 'province', 'city', 'tradeArea'] // 表示在何等级可用
          //   }
          // })
          // _this.$store.commit('SET_IS_MES', 'true')
        }
        let result
        if (item.code == '303' || item.code == '304') {
          // result = await divideAreaDetail({ config_id: item.configId })
        } else {
          // result = await buildingLineDetail({ id: item.configId })
        }

        if (result.data) {
          // let configDetail = {
          //   name: result.data.organizeName,
          //   id: item.organizeId,
          //   type: 'place',
          //   config: {
          //     configId: item.configId,
          //     configName: result.data.configName,
          //     verifyStatus: result.data.verifyStatus,
          //     previewCallStatus: result.data.previewCallStatus
          //   }
          // }
          // AppContext.UI_SUIT['RoutePlanning'].viewCtr(true)
          // AppContext.UI_SUIT['RoutePlanning'].locationFunction(type, configDetail)
        }
        // _this.$emit('closeMesCenterShow', '')
      }
    },
    // 获取配置详情
    async getConfigDtl() {}
  }
}
</script>
<style lang="less" scoped>
.list_box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  // top: 0;
  // left: 0;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  z-index: 50;
  overflow: hidden;

  /deep/ .el-dialog__footer {
    background: #fff;
    border-top: 1px solid #d8e4f0;
    padding-bottom: 10px;
  }

  /deep/ .el-dialog__body {
    padding: 40px 20px;
  }
}

.tagBox {
  width: 90%;
  background-color: #ffffff;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 40px;
  box-sizing: border-box;
  span {
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    display: inline-block;
    padding: 0 20px;
    position: relative;
  }

  .active {
    color: #930ceaff;
    border-bottom: 2px solid #930ceaff;
  }

  i {
    width: 20px;
    height: 20px;
    background-color: #ed3f14;
    color: #fff;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    line-height: 20px;
    border-radius: 10px;
    z-index: 100;
    font-size: 10px;
  }
}

.info_box {
  flex: 1;
  width: 90%;
  background-color: #ffffff;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 50px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-sizing: border-box;
}

.tab_box {
  display: flex;
  margin-left: 40px;
  justify-content: space-between;
  margin-right: 40px;

  .leftTab {
    width: 300px;
    display: flex;

    .tabInfo {
      width: 100px;
      align-items: center;
      line-height: 30px;
      height: 32px;
      text-align: center;
      color: #495060;
      cursor: pointer;
      border: 1px solid #dddee1;
      position: relative;

      &.left {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }

      &.right {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      em {
        width: 20px;
        height: 20px;
        background-color: #ed3f14;
        color: #fff;
        position: absolute;
        top: -10px;
        right: -10px;
        text-align: center;
        line-height: 20px;
        border-radius: 10px;
        z-index: 100;
        font-size: 10px;
      }
    }

    .active {
      background-color: #930cea;
      color: #fff;
      border-color: #930cea;
    }
  }
}

.table_box {
  margin-top: 20px;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  padding: 0 40px;
  flex: 1;
  overflow: auto;
  .el-table {
    width: 100%;
  }
  .stateName {
    cursor: pointer;
  }

  /deep/ .el-table {
    overflow: visible;
  }

  /deep/ .el-table td {
    padding: 20px 0;
  }

  /deep/ .el-table .cell {
    position: relative;
    overflow: visible;
  }

  /deep/ .el-table__body-wrapper {
    overflow: visible;
  }

  .process {
    position: absolute;
    top: 0;
    left: 100px;
    z-index: 100;
  }

  .img {
    width: 48px;
    height: 48px;
    border-radius: 5px;
    background-color: #597ef7;
    margin-right: 20px;
    position: relative;
    line-height: 48px;
    text-align: center;
    .icon {
      width: 100%;
      height: 100%;
      margin-bottom: -5px;
    }
    em {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      top: -5px;
      right: -5px;
      background-color: #ed3f14;
    }
  }

  .recallBtn {
    color: #ff9900;
  }

  .borderL {
    border-left: 1px solid #979797;
  }

  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .btn {
    padding: 0 15px;
    cursor: pointer;
  }
}
.page_Box {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
}
.dialogMes {
  font-size: 16px;
  color: #1f2d3d;
}

.cursor {
  cursor: pointer;
}

.no {
  display: none!important;
}

.flex {
  display: flex;
}

.color_CEA {
  color: #930cea;
}

.color_yellow {
  color: #f5a623;
}

.color_grey {
  color: #9b9b9b;
}

.color_green {
  color: #19be6b;
}

.color_red {
  color: #ed3f14;
}

.color_black {
  color: #000;
}

.f14 {
  font-size: 14px;
}

.p40 {
  padding: 0 40px;
}
</style>
