<template>
  <div class="demo">
    element demo is here
    <div class="tableBox">
      <el-table
        class="kmrs_table_deep"
        :data="tableData"
        border
        size="small"
        style="width: 100%"
      >
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
      <el-table
        class="kmrs_table_light"
        :data="tableData"
        border
        size="small"
        style="width: 100%"
      >
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>

    <div class="selectBox">
      <el-select
        v-model="value"
        placeholder="请选择"
        size="small"
        class="kmrs_select_deep"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="value"
        placeholder="请选择"
        disabled
        size="small"
        class="kmrs_select_deep"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-select
        v-model="value"
        placeholder="请选择"
        multiple
        size="small"
        class="kmrs_select_light"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="value"
        placeholder="请选择"
        disabled
        size="small"
        class="kmrs_select_light"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-input
        v-model="input"
        placeholder="请输入内容"
        size="small"
        class="kmrs_input_deep"
      ></el-input>
      <el-input
        v-model="input"
        placeholder="请输入内容"
        size="small"
        disabled
        class="kmrs_input_deep"
      ></el-input>

      <el-input
        v-model="input"
        placeholder="请输入内容"
        size="small"
        class="kmrs_input_light"
      ></el-input>
      <el-input
        v-model="input"
        placeholder="请输入内容"
        size="small"
        disabled
        class="kmrs_input_light"
      ></el-input>
    </div>

    <div style="padding-top: 100px;background: #0A2757">
      <el-radio v-model="radio" label="1" class="kmrs_radio_deep"
        >备选项</el-radio
      >
      <el-radio v-model="radio" label="2" class="kmrs_radio_light"
        >备选项</el-radio
      >

      <el-radio-group
        v-model="radio1"
        size="small"
        class="kmrs_radio_button_deep"
      >
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京" disabled></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div style="padding-top: 100px;background: #0A2757">
      <el-tree
        class="kmrs_tree_deep"
        :data="dataTree"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"
      ></el-tree>
    </div>
    <div style="padding-top: 100px;background: #0A2757">
      <el-tree
        class="kmrs_tree_light"
        :data="dataTree"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"
      ></el-tree>
    </div>
  </div>
</template>
<script>
export default {
  title() {
    return 'element demo'
  },
  name: 'Login',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      value: '',
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      input: '',
      radio: '2',
      radio1: '上海',

      dataTree: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          disabled: true,
          children: [
            {
              id: 5,
              label: '二级 2-1',
              disabled: true
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss"></style>
