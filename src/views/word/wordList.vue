<template>
  <div class="page">
    <h1><em></em><b>文档管理</b> <span>文档下载和导出</span></h1>
    <!-- 搜索过滤项 -->
    <div class="searchBox">
      <div class="name">
        <el-input
          v-model="fileName"
          placeholder="请输入文件名"
          size="mini"
          class="input"
          clearable
        ></el-input>
        <el-input
          v-model="metaName"
          placeholder="请输入专案名"
          size="mini"
          class="input"
          clearable
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          class="button"
          @click="search"
          v-auth="'doc:manage:search'"
          >搜索</el-button
        >
      </div>
      <div class="date">
        <span>操作日期：</span>
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="请选择日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <em>至</em>
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="请选择日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button
          type="primary"
          size="mini"
          class="button"
          @click="search"
          v-auth="'doc:manage:select'"
          >查找</el-button
        >
      </div>
    </div>
    <div class="tabs">
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth"
          >定时任务补偿</el-tab-pane
        >
      </el-tabs> -->
      <div
        class="pane"
        :class="{ active: tabValue == item.value }"
        v-for="(item, index) in tabsList"
        :key="index"
        @click="changeType(item.value)"
      >
        {{ item.lable }}
      </div>
    </div>
    <!-- 批量操作按钮 -->
    <div class="operate">
      <el-button size="small" @click="allDown" v-auth="'doc:manage:download'"
        >批量下载</el-button
      >
      <el-button size="small" @click="allDel" v-auth="'doc:manage:delete'"
        >批量删除</el-button
      >
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="dataList"
        tooltip-effect="dark"
        width="100%"
        :max-height="tableHeight"
        :header-cell-style="{ color: '#333333', background: '#F8F8F9' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="文件名称">
          <template slot-scope="scope">
            {{ scope.row.fileName }}
          </template>
        </el-table-column>
        <el-table-column label="专案名称">
          <template slot-scope="scope">
            {{ scope.row.metaName }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件类型" width="120">
          <template slot-scope="scope">
            <span class="typeColor" :class="'type' + scope.row.fileTypeCode">{{
              scope.row.fileType
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="创建时间">
          <template slot-scope="scope" style="color: #8a8a8a">{{
            scope.row.createTime
          }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <span
              @click="down(scope.row.id)"
              class="btn"
              v-auth="'doc:manage:download'"
            >
              下载&nbsp;|
            </span>
            <span
              class="btn"
              @click="del([scope.row.id])"
              v-auth="'doc:manage:delete'"
            >
              &nbsp;删除</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: 500,
      fileName: '',
      metaName: '',
      endTime: '',
      startTime: '',
      activeName: 'first',
      tabValue: 0,
      ids: [],
      tabsList: [
        {
          lable: '全部',
          value: 0
        },
        {
          lable: '计划书',
          value: 1
        },
        {
          lable: '问卷',
          value: 2
        },
        {
          lable: '测试材料',
          value: 3
        },
        {
          lable: '报告',
          value: 5
        },
        {
          lable: '数据档',
          value: 4
        }
      ],
      dataList: [],
      multipleSelection: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit('addTabs', {
        title: '文档管理',
        link: '/export/word-list',
        on: true,
        needCatch: true
      })
    })
  },
  mounted() {
    if (this.$route.query.tabValue) {
      this.tabValue = this.$route.query.tabValue
    }
    if (this.$route.query.metaName) {
      this.metaName = this.$route.query.metaName
    }
    this.getList()
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 350
      window.onresize = () => {
        this.tableHeight = window.innerHeight - 350
      }
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.ids = []
      console.log(val)
      for (let i in val) {
        this.ids.push(val[i].id)
      }
    },
    changeType(value) {
      this.tabValue = value
      this.pageNum = 1
      this.getList()
    },
    search() {
      this.pageNum = 1
      this.getList()
    },
    down(id) {
      this.downLoad([id])
    },
    allDown() {
      this.downLoad(this.ids)
    },
    allDel() {
      this.del(this.ids)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getList()
    },
    getList() {
      this.$fetch
        .get('/api/kmrs/doc/document/list', {
          fileName: this.fileName,
          metaName: this.metaName,
          startTime: this.startTime ? this.startTime : '',
          endTime: this.endTime ? this.endTime : '',
          fileType: this.tabValue,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        .then((res) => {
          if (res.errorCode != 0) {
            this.$message({
              message: res.errorMsg,
              type: 'error'
            })
            return
          }
          this.pageNum = res.resultBody.current
          this.total = res.resultBody.total
          this.dataList = res.resultBody.records
          console.log(this.dataList)
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    downLoad(ids) {
      let url = `/api/kmrs/doc/document/download?ids=${ids}`
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.style.height = 0
      iframe.src = url
      document.body.appendChild(iframe)
    },
    del(ids) {
      this.$fetch
        .post(
          '/api/kmrs/doc/document/del',
          {
            ids: ids.toString()
          },
          true
        )
        .then((res) => {
          if (res.errorCode != 0) {
            this.$message({
              message: res.errorMsg,
              type: 'error'
            })

            return
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  h1 {
    display: flex;
    align-items: flex-end;
    em {
      width: 5px;
      height: 18px;
      background: #930cea;
    }
    b {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      margin: 0 15px 0 10px;
    }
    span {
      font-size: 12px;
      font-weight: 400;
      color: #6d7278;
    }
  }
  .searchBox {
    display: flex;
    margin: 20px 0;
    .name {
      display: flex;

      .input {
        margin-right: 10px;
      }
    }
    .date {
      display: flex;
      align-items: center;
      margin-left: 30px;
      em {
        font-style: normal;
        padding: 0 5px;
      }
      .button {
        margin-left: 10px;
      }
    }
  }
  .tabs {
    display: flex;
    border-bottom: 1px solid #e0e6ed;
    justify-content: center;
    .pane {
      width: 100px;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      color: #afafaf;
      cursor: pointer;
      &.active {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        border-bottom: 3px solid #930cea;
      }
    }
  }
  .operate {
    margin-top: 25px;
    margin-bottom: 20px;
  }
  .table {
    .btn {
      color: #930cea;
      cursor: pointer;
    }
    .typeColor {
      border: 1px solid #2d8cf0;
      border-radius: 2px;
      padding: 2px 10px;

      &.type1 {
        border-color: #930cea;
        background: #f8ebff;
        color: #930cea;
      }
      &.type2 {
        border-color: #f7a100;
        background: #fff6e6;
        color: #f7a100;
      }
      &.type3 {
        border-color: #fa6400;
        background: #ffedeb;
        color: #fa6400;
      }
      &.type4 {
        border-color: #2d8cf0;
        background: #f1f8ff;
        color: #2d8cf0;
      }
      &.type5 {
        border-color: #2dba3c;
        background: #f1ffe2;
        color: #2dba3c;
      }
    }
  }
  .pagination {
    text-align: right;
    padding-top: 20px;
  }
}
</style>