<template>
  <div class="user_box">
    <div class="tabs_box">
      <el-tabs v-model="activeName" :tab-position="tabPosition">
        <el-tab-pane label="基本信息" name="info">
          <h4>个人信息</h4>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            label-position="left"
            class="demo-ruleForm"
          >
            <el-form-item label="头像">
              <img class="imgBox" src="/img/wdzh_tx.png" alt />
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ userInfo.loginName ? userInfo.loginName : '-' }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ userInfo.name ? userInfo.name : '-' }}</span>
            </el-form-item>
            <el-form-item label="部门">
              <span>{{ parentNames ? parentNames : '-' }}</span>
            </el-form-item>
            <el-form-item label="职位">
              <span>{{ userInfo.position ? userInfo.position : '-' }}</span>
            </el-form-item>
          </el-form>
          <div class="iphoneBox" style="">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              label-width="80px"
              label-position="left"
              class="demo-ruleForm"
            >
              <el-form-item label="手机号码">
                <span>{{ mobileNumber ? mobileNumber : '-' }}</span>
              </el-form-item>
              <el-form-item label="电子邮箱">
                <span>{{ email ? email : '-' }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="更改密码" name="pass">
          <h4>修改密码</h4>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            label-position="left"
            class="demo-ruleForm"
          >
            <el-row>
              <el-col :span="13">
                <el-form-item label="当前密码" prop="oldpass">
                  <el-input
                    type="password"
                    size="mini"
                    class="kmrs_input_light"
                    v-model="ruleForm.oldpass"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item label="新密码" prop="pass">
                  <el-input
                    type="password"
                    size="mini"
                    class="kmrs_input_light"
                    v-model="ruleForm.pass"
                    autocomplete="off"
                    placeholder="请输入"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item label="重复新密码" prop="checkPass">
                  <el-input
                    type="password"
                    size="mini"
                    class="kmrs_input_light"
                    v-model="ruleForm.checkPass"
                    autocomplete="off"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                @click="submitForm('ruleForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
// import qs from "qs";
// import { mapGetters } from "vuex";
export default {
  data() {
    var oldpass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('当前密码不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tabPosition: 'left',
      userInfo: {
        loginName: this.$cookies.get('userName')
          ? this.$cookies.get('userName')
          : '-',
        name: this.$cookies.get('nickName')
          ? this.$cookies.get('nickName')
          : '-',
        position: this.$cookies.get('userInfo').position
          ? this.$cookies.get('userInfo').position
          : '-',
        email: this.$cookies.get('userInfo').email
          ? this.$cookies.get('userInfo').email
          : '-',
        mobileNumber: this.$cookies.get('userInfo').mobile
          ? this.$cookies.get('userInfo').mobile
          : '-',
        parentNames: this.$cookies.get('userInfo').dept
          ? this.$cookies.get('userInfo').dept
          : '-'
      },
      activeName: '', //'pass'
      parentNames: '',
      mobileNumber: '',
      email: '',
      ruleForm: {
        pass: '',
        checkPass: '',
        oldpass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        oldpass: [{ validator: oldpass, trigger: 'blur' }]
      }
    }
  },
  props: ['userInfoType'],
  computed: {
    // ...mapGetters(["userInfo"])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: `我的账户`,
        link: '/account',
        on: true,
        needCatch: true
      })
    })
  },
  created() {
    this.activeName = location.search.substring(1).split('=')[1]
    let name = this.userInfo.parentNames.split(',')
    for (let i = 0; i < name.length; i++) {
      let Symbol = '>'
      if (i == name.length - 1) {
        Symbol = ''
      }
      this.parentNames = this.parentNames + name[i] + Symbol
    }
    var pat = /(\d{3})\d*(\d{4})/
    this.mobileNumber = this.userInfo.mobileNumber.replace(pat, '$1****$2')
    const reg = /(.{1}).+(.{2}@.+)/g
    this.email = this.userInfo.email.replace(reg, '$1****$2')
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submit() {
      var contentType = 'multipart/form-data'
      const postData = {
        password: this.ruleForm.oldpass,
        newPassword: this.ruleForm.pass,
        confirmPassword: this.ruleForm.checkPass
      }
      this.$fetch
        .post('/user-api/sys/user/info/password', postData, contentType)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: '密码修改成功',
              type: 'success'
            })
            let _this = this
            setTimeout(function() {
              _this.$router.push({
                path: '/login'
              })
              window.location.reload()
              window.sessionStorage.clear()
              window.localStorage.clear()
              this.$cookies.remove('nickName')
              this.$cookies.remove('userId')
              this.$cookies.remove('userName')
              this.$cookies.remove('userInfo')
            }, 2000)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: "error"
            // });
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.user_box ::v-deep {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  // top: 0;
  // left: 0;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  // z-index: 10000000;
  .el-tabs__content {
    .el-tab-pane {
      .el-button {
        width: 80px;
        height: 32px;
        // background: #C581F1;
        // border-color: #C581F1;
        span {
          color: #fff;
        }
      }
    }
  }
}
.tabs_box ::v-deep {
  flex: 1;
  width: 90%;
  background-color: #ffffff;
  margin: 20px auto;
  margin-top: 10px;
  margin-bottom: 50px;
  padding-top: 30px;
  .el-form-item__label {
    color: #4d4d4d;
    font-size: 12px;
  }
  .el-form-item__content {
    width: 300px;
    .imgBox {
      width: 40px;
      height: 40px;
    }
  }
  .iphoneBox {
    border-top: 1px solid #ced3dd;
    padding-top: 10px;
  }
  .el-tabs__content {
    padding-left: 36px;
    padding-right: 36px;
    // width: 660px;
    height: 600px;
    border-left: 2px solid #e9eaec;
  }
  .el-tabs__item {
    width: 160px;
  }
  .el-tabs__item:hover {
    color: #303133;
  }
  .el-tabs__item.is-active {
    background: #fbebfe;
  }
  .el-tabs--left .el-tabs__header.is-left {
    margin-right: -1px;
  }
  .el-tabs__active-bar.is-left {
    width: 4px;
  }
  h4 {
    font-size: 18px;
    color: #4d4d4d;
    margin-bottom: 20px;
  }
  span {
    color: #495060;
    font-size: 12px;
  }
}
i {
  margin-right: 5px;
}
.phone {
  margin-bottom: 5px;
}
.f12 {
  font-size: 12px;
}
.color_grey {
  color: #ced3dd;
}
.pl10 {
  padding-left: 10px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
