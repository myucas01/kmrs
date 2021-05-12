<template>
  <div class="page">
    <div class="factorBox">
      <el-tabs v-model="tabsValue" @tab-click="tabsChange">
        <el-tab-pane label="产品测试" name="1"></el-tab-pane>
        <el-tab-pane label="概念筛选" name="2"></el-tab-pane>
      </el-tabs>
      <div class="selectBox" v-show="tabsValue == '1'">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          class="mr20"
          value-format="yyyy-MM-dd"
          width="200"
        >
        </el-date-picker>
        <el-select
          v-model="categoryValue"
          placeholder="品类"
          size="mini"
          class="mr20 w140"
          filterable
          clearable
          multiple
          collapse-tags
          @change="categoryVal"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="tasteValue"
          placeholder="口味"
          size="mini"
          class="mr20"
          filterable
          clearable
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in tasteList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="priceValue"
          placeholder="价格带"
          size="mini"
          class="mr20"
          v-if="project_type == 'km'"
          filterable
          clearable
        >
          <el-option
            v-for="item in priceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="sweetTaste"
          placeholder="甜度"
          size="mini"
          class="mr20"
          v-if="project_type == 'ky'"
          filterable
          clearable
        >
          <el-option
            v-for="item in sweetTasteList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-cascader
          size="mini"
          class="mr20"
          placeholder="品牌"
          v-model="brandValue"
          :options="brandList"
          :props="props"
          filterable
          collapse-tags
          clearable
          ref="brand"
          @change="brandChange"
        ></el-cascader>
        <el-button size="mini" class="mr10" @click="reset">重置条件</el-button>
        <el-button type="primary" size="mini" class="mr20" @click="submit"
          >确定</el-button
        >
      </div>
      <div class="selectBox" v-show="tabsValue == '2'">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          class="mr20"
          width="200"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-cascader
          size="mini"
          class="mr20"
          placeholder="品类"
          v-model="categoryValue"
          :options="categoryList1"
          :props="categoryprops"
          filterable
          collapse-tags
          clearable
          ref="category"
          @change="categoryChange"
          :show-all-levels="false"
        ></el-cascader>
        <el-button size="mini" class="mr10" @click="reset">重置条件</el-button>
        <el-button type="primary" size="mini" class="mr20" @click="submit"
          >确定</el-button
        >
      </div>
    </div>
    <div class="bottom_box">
      <div class="tableBox" v-if="tabsValue == '1'">
        <div id="productTable"></div>
      </div>
      <div class="tableBox" v-if="tabsValue == '2'">
        <div id="conceptTable"></div>
      </div>

      <!-- <biTablea ref="biDataba" :idname="'tableb'" v-show="tabsValue =='2'"></biTablea> -->
    </div>

    <div class="dialog" v-if="dialogShow">
      <div class="item">
        <h5>共{{ mateLength }}条搜索结果 <span>多选</span></h5>
        <div style="padding: 10px 10px 0; background: #ffffff">
          <el-input
            v-model="searchName"
            @input="changeInput"
            placeholder="请输入内容"
            size="mini"
            clearable
          ></el-input>
        </div>

        <div class="list" id="nameInput">
          <div
            class="row"
            v-for="(item, index) in filterPremission(mateList)"
            :key="index"
            @click="changeMate(item)"
            :class="{ check: item.check }"
          >
            <div>{{ tabsValue == '1' ? item.metaName : item.cptName }}</div>
            <b v-show="item.check"><i class="el-icon-check"></i></b>
          </div>
          <p class="nolist" v-if="mateList.length == 0">暂无数据</p>
        </div>
        <div class="btnBox">
          <el-button size="mini" class="mr10" @click="dialogShow = false"
            >取消</el-button
          >
          <el-button type="primary" size="mini" class="mr20" @click="getdata"
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import zh_json from '@/util/zh.json'
import { createScript } from '@/util'
export default {
  data() {
    return {
      tabsValue: '1',
      date: '',
      classType: '',
      classTypeList: [],
      dialogShow: false,
      productTable: '',
      conceptTable: '',
      sumList: [],
      dataList: [],
      dataList1: [],
      categoryList: [],
      categoryList1: [],
      categoryValue: [],
      tasteValue: [],
      tasteList: [],
      priceList: [],
      priceValue: '',
      brandValue: [],
      brandList: [],
      brandValueList: [],
      categoryValueList: [],
      mateList: [], //专案列表
      mateLength: 0,
      searchName: '',
      props: { multiple: true, children: 'campaignName' },
      categoryprops: { multiple: true, children: 'child' },
      project_type: '',
      sweetTaste: '',
      sweetTasteList: []
    }
  },
  mounted() {
    let _this = this
    this.getOptions()
    this.getcategoryOptions()
    // this.getdata()
    createScript('/js/webdatarocks.toolbar.min.js', () => {
      createScript('/js/webdatarocks.js', () => {
        _this.productTableCreat()
        // _this.conceptTableCreat()
      })
    })
    // 获取当前项目是km || ky
    this.project_type = this.getCookie('customerType')
    if (this.project_type == 'ky') {
      this.getSweet()
    } else {
      this.getprice()
    }
  },
  methods: {
    getCookie(name) {
      // 获取cookie字符串 => 数组
      let cookie_str = document.cookie
      let cookie_arr = cookie_str.split('; ')
      //遍历匹配
      for (let i = 0; i < cookie_arr.length; i++) {
        let cookie = cookie_arr[i].split('=')
        if (cookie[0] === name) {
          return cookie[1]
        }
      }
      return ''
    },
    filterPremission(list) {
      let _search = this.searchName
      let _this = this
      if (_search) {
        //不区分大小写处理
        let reg = new RegExp(_search, 'ig')
        //es6 filter过滤匹配，有则返回当前，无则返回所有
        return this.mateList.filter(function (e) {
          //匹配所有字段
          // return Object.keys(e).some(function(key) {
          //     return e[key].match(reg);
          // })
          //匹配某个字段
          if (_this.tabsValue == '1') {
            return e.metaName.match(reg)
          } else {
            return e.cptName.match(reg)
          }
        })
      }
      return list
    },
    changeInput() {
      this.$nextTick(() => {
        let x = document.getElementsByClassName('row')
        console.log(x.length)
        this.$set(this, 'mateLength', x.length)
      })
      // console.log(this.mateList)
      // let x = document.getElementsByClassName('row')
      // console.log(x.length)
    },
    tabsChange() {
      let _this = this
      this.searchName = ''
      this.reset()
      if (this.tabsValue == '1') {
        this.dataList = []
        setTimeout(() => {
          _this.productTableCreat()
        }, 100)
        // this.productTable.refresh()
      } else {
        this.dataList1 = []

        // this.conceptTable.refresh()
        setTimeout(() => {
          _this.conceptTableCreat()
        }, 100)
      }
    },
    getcategoryOptions() {
      //品类
      this.$fetch
        .get('/api/common/cptCategory', {})
        .then((res) => {
          this.categoryList1 = res.resultBody
          console.log(this.dataList)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    //选择品类
    categoryVal() {
      this.tasteValue = []
      this.gettaste()
    },
    getSweet() {
      //甜度
      this.$fetch
        .get('/api/common/sweet', {
          isLoading: false
        })
        .then((res) => {
          this.sweetTasteList = res.resultBody.records
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    gettaste() {
      //口味
      this.$fetch
        .get('/api/common/taste', {
          isLoading: false,
          typeGroupName: this.categoryValue.toString()
        })
        .then((res) => {
          this.tasteList = res.resultBody.records
          console.log(this.dataList)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    getprice() {
      //价格带
      this.$fetch
        .get('/api/common/price', { isLoading: false })
        .then((res) => {
          this.priceList = res.resultBody.records
          console.log(this.dataList)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    getOptions() {
      //品类
      this.$fetch
        .get('/api/common/category', { isLoading: false })
        .then((res) => {
          this.categoryList = res.resultBody.records
          console.log(this.dataList)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })

      //品牌
      this.$fetch
        .get('/api/common/brand', { isLoading: false })
        .then((res) => {
          this.brandList = res.resultBody
          console.log(this.dataList)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    reset() {
      this.date = ''
      this.categoryValue = []
      this.tasteValue = []
      this.priceValue = ''
      this.brandValue = []
    },
    brandChange() {
      console.log(this.brandValue)
      // let list=[]
      console.log(this.$refs.brand.getCheckedNodes(true))
      let list = this.$refs.brand.getCheckedNodes(true)
      let arr = []
      for (let i in list) {
        arr.push({
          level: list[i].level,
          value: list[i].value
        })
      }
      console.log(arr)
      this.brandValueList = arr
    },
    categoryChange(val) {
      console.log(val)
      // let list=[]
      console.log(this.$refs.category.getCheckedNodes(true))
      let list = this.$refs.category.getCheckedNodes(true)
      let arr = []
      for (let i in list) {
        arr.push({
          level: list[i].level,
          value: list[i].value
        })
      }

      console.log(arr)
      this.categoryValueList = arr
    },
    //获取专案列表
    getList() {
      // if(!this.date){
      //   this.date = ['','']
      // }
      let url = ''
      let obj = ''
      if (this.tabsValue == '1') {
        url = '/api/meta/list'
        obj = {
          category: this.categoryValue, //品类
          taste: this.tasteValue ? this.tasteValue : [], //口味
          price: this.priceValue ? [this.priceValue] : [],
          brand: this.brandValue,
          sweetTaste: this.sweetTaste,
          beginDate: this.date ? this.date[0] : '',
          endDate: this.date ? this.date[1] : ''
        }
      } else {
        url = '/api/meta/cptList'
        obj = {
          cptCategory: this.categoryValue, //品类
          type: '0',
          beginDate: this.date ? this.date[0] : '',
          endDate: this.date ? this.date[1] : ''
        }
      }
      this.$fetch
        .post(url, obj)
        .then((res) => {
          this.mateList = res.resultBody
          this.mateLength = res.resultBody.length
          for (let i in this.mateList) {
            this.mateList[i].check = false
          }
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    changeMate(item) {
      item.check = !item.check
      this.$forceUpdate()
    },
    submit() {
      if (
        this.tabsValue == '1' &&
        this.project_type == 'km' &&
        !this.date &&
        this.categoryValue.length == 0 &&
        this.tasteValue.length == 0 &&
        !this.priceValue &&
        this.brandValue.length == 0
      ) {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
        return
      }
      if (
        this.tabsValue == '1' &&
        this.project_type == 'ky' &&
        !this.date &&
        this.categoryValue.length == 0 &&
        this.tasteValue.length == 0 &&
        !this.sweetTaste &&
        this.brandValue.length == 0
      ) {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
        return
      }
      if (
        this.tabsValue == '2' &&
        !this.date &&
        this.categoryValue.length == 0
      ) {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
        return
      }
      this.getList()
      this.dialogShow = true
    },
    getdata() {
      let _this = this
      let values = []
      for (let i in this.mateList) {
        if (this.mateList[i].check) {
          if (this.tabsValue == '1') {
            values.push(this.mateList[i].metaGuid)
          } else {
            values.push(this.mateList[i].cptId)
          }
        }
      }
      console.log(values)
      if (values.length == 0) {
        this.$message({
          message: '请选择专案',
          type: 'warning'
        })
        return
      }
      let url = ''
      let obj = ''
      if (this.tabsValue == '1') {
        url = '/api/BI/list'
        obj = {
          MetaGuids: values.toString()
        }
      } else {
        url = '/api/BI/cptBIList'
        obj = {
          CptGuids: values.toString()
        }
      }
      this.dialogShow = false
      this.$fetch
        .get(url, obj)
        .then((res) => {
          console.log(res.resultBody)
          this.dataList = res.resultBody
          setTimeout(() => {
            if (this.tabsValue == '1') {
              this.dataList = res.resultBody
              _this.productTableCreat()
            } else {
              this.dataList1 = res.resultBody
              _this.conceptTableCreat()
            }
          }, 100)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    productTableCreat() {
      let _this = this
      console.log(_this.dataList)
      console.log(_this.sumList)
      this.productTable = new WebDataRocks({
        container: '#productTable',
        height: '800',
        beforetoolbarcreated: customizeToolbar,
        toolbar: true,
        report: {
          // formats: [
          //   {
          //     name: 'currency',
          //     decimalPlaces: 2,
          //     nullValue: '-',
          //     currencySymbol: '%',
          //     isPercent: true
          //   },
          //   {
          //     name: 'sum',
          //     decimalPlaces: 2,
          //     nullValue: '-'
          //   }
          // ],
          dataSource: {
            data: _this.dataList
          },
          options: {
            grid: {
              type: 'classic',
              title: _this.title,
              showReportFiltersArea: true,
              showTotals: 'off' //是否 显示小计
              // showGrandTotals: 'off' //是否 显示总计
            },
            configuratorActive: false,
            showAggregationLabels: false,
            showDefaultSlice: false
          },
          cellData: {
            height: 500
          },
          slice: {
            rows: [
              // //默认选中 字段
              // {
              //   uniqueName: '产品-统计规格'
              // },
              // {
              //   uniqueName: '产品-品牌'
              // }
            ],
            columns: [
              // {
              //   uniqueName: '组织-行销公司',
              //   sort: 'asc'
              // }
            ],
            measures: [
              //计算值 配置
              // {
              //   uniqueName: '推算销额',
              //   aggregation: 'none',
              //   active:false,
              // },
              // {
              //   uniqueName: '同比销额',
              //   aggregation: 'sum',
              //   format: 'sum'
              // }
            ],
            // measures: _this.sumList,
            drills: {
              //下钻
              drillAll: true,
              rows: [
                {
                  tuple: ['Business Type.Warehouse']
                }
              ]
            },
            expands: {
              //展开
              expandAll: true
            }
          }
        },
        global: {
          // replace this path with the path to your own translated file
          localization: zh_json
        }
      })
      //删除工具栏
      function customizeToolbar(toolbar) {
        var tabs = toolbar.getTabs() // get all tabs from the toolbar
        console.log(tabs)
        console.log(tabs) // delete the first tab)
        toolbar.getTabs = function () {
          delete tabs[0] // delete the first tab
          delete tabs[1] // delete the first tab
          delete tabs[2] // delete the first tab
          delete tabs[3].menu[0]
          delete tabs[3].menu[1]
          delete tabs[3].menu[3]
          return tabs
        }
      }
    },

    conceptTableCreat() {
      let _this = this
      this.conceptTable = new WebDataRocks({
        container: '#conceptTable',
        height: '800',
        beforetoolbarcreated: customizeToolbar,
        toolbar: true,
        report: {
          // formats: [
          //   {
          //     name: 'currency',
          //     decimalPlaces: 2,
          //     nullValue: '-',
          //     currencySymbol: '%',
          //     isPercent: true
          //   },
          //   {
          //     name: 'sum',
          //     decimalPlaces: 2,
          //     nullValue: '-'
          //   }
          // ],
          dataSource: {
            data: _this.dataList1
          },
          options: {
            grid: {
              type: 'classic',
              title: _this.title,
              showReportFiltersArea: true,
              showTotals: 'off' //是否 显示小计
              // showGrandTotals: 'off' //是否 显示总计
            },
            configuratorActive: false,
            showAggregationLabels: false,
            showDefaultSlice: false
          },
          cellData: {
            height: 500
          },
          slice: {
            rows: [
              // //默认选中 字段
              // {
              //   uniqueName: '产品-统计规格'
              // },
              // {
              //   uniqueName: '产品-品牌'
              // }
            ],
            columns: [
              // {
              //   uniqueName: '组织-行销公司',
              //   sort: 'asc'
              // }
            ],
            measures: [
              //计算值 配置
              // {
              //   uniqueName: '推算销额',
              //   aggregation: 'none',
              //   active:false,
              // },
              // {
              //   uniqueName: '同比销额',
              //   aggregation: 'sum',
              //   format: 'sum'
              // }
            ],
            // measures: _this.sumList,
            drills: {
              //下钻
              drillAll: true,
              rows: [
                {
                  tuple: ['Business Type.Warehouse']
                }
              ]
            },
            expands: {
              //展开
              expandAll: true
            }
          }
        },
        global: {
          // replace this path with the path to your own translated file
          localization: zh_json
        }
      })
      //删除工具栏
      function customizeToolbar(toolbar) {
        var tabs = toolbar.getTabs() // get all tabs from the toolbar
        console.log(tabs) // delete the first tab)
        toolbar.getTabs = function () {
          delete tabs[0] // delete the first tab
          delete tabs[1] // delete the first tab
          delete tabs[2] // delete the first tab
          delete tabs[3].menu[0]
          delete tabs[3].menu[1]
          delete tabs[3].menu[3]
          return tabs
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  // height: 800px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  .mr20 {
    margin-right: 20px;
  }
  .mr10 {
    margin-right: 10px;
  }
}
.factorBox {
  padding: 10px 15px 20px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  .el-date-editor {
    width: 300px;
    font-size: 12px;
  }
  .el-select,
  .el-cascader {
    width: 300px;
    margin-top: 10px;
  }
}
.bottom_box {
  flex: 1;
  display: flex;
  width: 100%;
  position: relative;
  .tableBox {
    width: 100%;
    height: 100%;
    // position: absolute;
    // top: 0;
    // left: 0;
    opacity: 1;
    &.show {
      opacity: 1;
    }
  }
}
.dialog {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  .item {
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
    padding: 20px 10px;
    border-radius: 5px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    h5 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      padding: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #565656;
      line-height: 17px;
      border-bottom: 1px solid #e0e6ed;
    }
    .list {
      background: #ffffff;
      padding: 0 10px 10px;
      flex: 1;
      overflow: auto;
      .row {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        &.check {
          color: #930cea;
        }
        i {
          font-size: 16px;
          font-weight: 900;
        }
        .row-left {
          flex: 1;
          overflow: hidden;
        }
        .row-right {
          margin-left: 50px;
        }
      }
    }
    .nolist {
      text-align: center;
      font-size: 16px;
      color: #333333;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .btnBox {
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>