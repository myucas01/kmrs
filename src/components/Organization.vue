<template>
  <div class="org-body">
    <div
      class="organization"
      v-if="!organizationDisabled"
      @click="showOrganization()"
    >
      <span>{{ organizationName }}</span>
      <span class="el-icon-arrow-down"></span>
    </div>
    <div class="organization-disbaled" v-else>
      <span>{{ organizationName }}</span>
    </div>
    <div class="org-container" v-show="organization">
      <div class="s-title">
        <span>组织选择</span>
        <span class="el-icon-close" @click="closeOrganizationSearch()"></span>
      </div>
      <div class="s-content">
        <!-- <div class="recently-tip">
					<p>最近选择</p>
					<p>
						<span>嘉定综合所</span>
						<span>昆山士多北所</span>
						<span>上海行销公司</span>
					</p>
				</div>
				<el-input placeholder="请输入" suffix-icon="el-icon-search" class="kmrs_input_deep"></el-input> -->
        <div class="s-orglist">
          <el-input
            placeholder="请输入组织名称"
            v-model="filterText"
            class="kmrs_input_deep"
            clearable
          ></el-input>
          <el-tree
            ref="orgTreeData"
            :data="orgData"
            :props="defaultProps"
            node-key="id"
            highlight-current
            class="kmrs_tree_deep"
            @node-click="orgNodeClick"
            :filter-node-method="filterNode"
          ></el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'organization',
  computed: {
    ...mapGetters('map', [
      'organizationName',
      'mapOrganization',
      'organizationDisabled',
      'orgCheckId'
    ])
  },
  data() {
    return {
      filterText: '',
      organization: false,
      orgData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  mounted() {
    this.getOrgList()
    this.$store.dispatch('map/setOrganizationDisabled', false)
  },
  watch: {
    mapOrganization() {
      this.$refs.orgTreeData.setCurrentKey(this.orgCheckId)
    },
    filterText(val) {
      this.$refs.orgTreeData.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getOrgList() {
      let _this = this
      let url = '/api/bn/store/position/getOrgListAuthority'
      _this.$fetch.get(url).then(res => {
        _this.$set(_this, 'orgData', res.data)
        console.log(res.data)
      })
    },
    // 组织树点击
    orgNodeClick(data, node) {
      this.$refs.orgTreeData.setCurrentKey(node.id)
      this.$store.dispatch('map/setOrgCheckId', node.data.id)
    },
    showOrganization() {
      let _this = this
      _this.organization = true
    },
    closeOrganizationSearch() {
      let _this = this
      _this.organization = false
    }
  }
}
</script>

<style scoped lang="scss">
.org-body {
  z-index: 2000;
  .organization,
  .organization-disbaled {
    position: absolute;
    top: 4px;
    right: 60px;
    padding: 0px 10px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    background: rgba(19, 55, 115, 0.5);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    font-size: 14px;

    &:hover {
      background: #102f63;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }

    span {
      &:first-child {
        margin-right: 23px;
      }
    }
  }

  .organization-disbaled {
    span {
      &:first-child {
        margin-right: 0px;
      }
    }
  }

  .org-container {
    position: absolute;
    z-index: 2001;
    right: 0px;
    top: 0px;
    width: 300px;
    height: calc(100% - 4px);
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
      color: #ffffff;
      padding: 14px;
      height: 100%;
      .recently-tip {
        margin-bottom: 15px;
        p {
          margin-bottom: 10px;
          font-size: 12px;

          &:first-child {
            font-size: 13px;
          }

          span {
            cursor: pointer;
            margin-right: 6px;
            display: inline-block;
            height: 24px;
            line-height: 24px;
            padding: 0px 5px;
            box-shadow: -2px 0px 4px 0px rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            border: 1px solid #8199a4;
          }
        }
      }

      .s-orglist {
        height: calc(100% - 150px);
        overflow: auto;
      }
    }

    ::v-deep .el-input__inner {
      height: 32px;
    }

    ::v-deep .el-input__icon {
      line-height: 32px;
      font-size: 14px;
    }

    ::v-deep .el-tree {
      background: #0a2757;
      color: #ffffff;
      margin-top: 5px;
      .el-tree-node__content {
        background: #0a2757;
        height: 32px;
        padding-left: 30px;
        &:hover {
          background: #4b1f98;
        }
      }
    }
  }
}
</style>
