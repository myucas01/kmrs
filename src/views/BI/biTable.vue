<template>
  <div class="exportExl">
    <div id="tableFrame">
      <div id="wdr-component"></div>
    </div>
  </div>
</template>

<script>
import { createScript } from '@/util'
import zh_json from '@/util/zh.json'
export default {
  name: 'about-page',
  data() {
    return {
      // 树结构元数据
      // label：不可改，必须，显示的节点名
      // children:不可改，必须，子节点
      // 其它字段可自行定义
      html_str: '',
      title: '',
      dataList: [], //数据
      sumList: [] //要显示的值
    }
  },
  props: ['MetaGuids', 'Questions', 'type'],
  mounted() {
    console.log(createScript)
    let _this = this
    createScript('/js/webdatarocks.toolbar.min.js', () => {
      createScript('/js/webdatarocks.js', () => {
        _this.tableCreat()
      })
    })
  },

  methods: {
    getdata() {
      let _this = this
      let url = ''
      let obj = ''
      if (this.type == '1') {
        url = '/api/BI/list'
        obj = {
          MetaGuids: this.MetaGuids,
          Questions: this.Questions
        }
      } else {
        url = '/api/BI/cptBIList'
        obj = {
          CptGuids: this.MetaGuids,
          Questions: this.Questions
        }
      }
      this.$fetch
        .get(url, obj)
        .then((res) => {
          this.dataList = res.resultBody
          setTimeout(() => {
            _this.tableCreat()
          }, 100)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    tableCreat() {
      let _this = this
      let pivot = new WebDataRocks({
        container: '#wdr-component',
        height: '100%',
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
      console.log(pivot)
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
    },
    getList(obj) {
      console.log(obj)
      this.dataList = obj.list
      this.sumList = obj.sum
      this.title = obj.title
      this.tableCreat()
    }
  }
}
</script>

<style lang="scss" scoped>
.exportExl {
  height: 100%;
}
.treeFrame {
  box-sizing: border-box;
  width: 10%;
  height: 100%;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
  float: left;
  margin-left: 40px;
  margin-top: 100px;
}
#tableFrame {
  width: 95%;
  margin-left: 50px;
  float: right;
  height: 100%;
  margin-right: 40px;
}
#wdr-component {
  height: 100%;
}
</style>
