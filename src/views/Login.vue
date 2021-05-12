<template>
  <div class="login">
    <main>
      <div>
        <div class="logo">
          <img src="/img/login-img.png" />
          <p>power by www.gaialab.ai</p>
        </div>
        <el-form :model="loginForm"
                 ref="loginForm">
          <img src="/img/kmrs-logo.png" />
          <el-form-item prop="name"
                        :rules="{ required: true, message: ' 请输入账号', trigger: 'blur' }"
                        class="username">
            <el-input v-model="loginForm.name"
                      placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="pwd"
                        :rules="{ required: true, message: ' 请输入密码', trigger: 'blur' }"
                        class="pwd">
            <el-input v-model="loginForm.pwd"
                      type="password"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <a class="forget" href="javascript:void(0);"
              >忘记密码？</a
            > -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <p>© 2021 上海晶确科技有限公司</p>
    </main>
  </div>
</template>
<script>
import { logout } from '@/util'
export default {
  title() {
    return '登录'
  },
  name: 'Login',
  data() {
    return {
      loginForm: {
        name: '',
        pwd: ''
      }
    }
  },
  mounted() {
    logout()
  },
  methods: {
    sortFunction(a, b) {
      return a.orderNum - b.orderNum
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$fetch
            .post(
              '/user-api/auth/login',
              {
                username: this.loginForm.name,
                password: this.loginForm.pwd
              },
              true
            )
            .then(res => {
              let resCode = res.code
              let resData = res.data
              const userId = resCode == 200 ? resData.userId : ''
              let orgId =
                resCode == 200 && resData.seniorOrgId != undefined
                  ? resData.seniorOrgId
                  : '5074727057550190748'
              const roleIdList = resCode == 200 ? resData.roleIdList : []
              const roleMenuVos = resCode == 200 ? resData.roleMenuVos : []
              const orgIdList = resCode == 200 ? resData.orgIdList : []
              const nickName = resCode == 200 ? resData.nickName : ''
              let menuList = resCode == 200 ? resData.menuList : []
              if (menuList.length > 0) {
                menuList = menuList.filter(t => {
                  return t.menuName != '系统管理'
                })
                menuList.sort(this.sortFunction)
                // menuList.map(item => {
                //   if (item.list) {
                //     item.list.sort(this.sortFunction)
                //   }
                // })
                var entryList = []
                menuList.map(item => {
                  if (item.jumpUrl) {
                    let { jumpUrl, copyName, menuName } = item
                    entryList.push({ jumpUrl, copyName, menuName })
                  }
                })
              }
              const authorities = resCode == 200 ? resData.authorities : []
              const userInfo =
                resCode == 200
                  ? {
                    email: resData.email || '',
                    mobile: resData.mobile || '',
                    position: resData.position || '',
                    dept: resData.dept || '',
                    avatarUrl: resData.avatarUrl || ''
                  }
                  : {}
              const customerType = resCode == 200 ? resData.customerType : 'ky'
              this.$cookies.set('userName', this.loginForm.name, {
                expires: '1M',
                domain: location.hostname
              })
              this.$cookies.set('userId', userId, {
                expires: '1M',
                domain: location.hostname
              })
              this.$cookies.set('orgId', orgId, {
                expires: '1M',
                domain: location.hostname
              })
              this.$cookies.set('nickName', nickName, {
                expires: '1M',
                domain: location.hostname
              })
              this.$cookies.set('userInfo', userInfo, {
                expires: '1M',
                domain: location.hostname
              })
              this.$cookies.set('customerType', customerType, {
                expires: '1M',
                domain: location.hostname
              })
              window.localStorage.setItem(
                'roleIdList',
                JSON.stringify(roleIdList)
              )
              window.localStorage.setItem(
                'roleMenuVos',
                JSON.stringify(roleMenuVos)
              )
              window.localStorage.setItem(
                'orgIdList',
                JSON.stringify(orgIdList)
              )
              window.localStorage.setItem(
                'menuList',
                JSON.stringify(menuList)
              )
              window.localStorage.setItem(
                'entryList',
                JSON.stringify(entryList)
              )
              window.localStorage.setItem(
                'authorities',
                JSON.stringify(authorities)
              )
              if (resCode == 200) {
                this.$router.push('/index')
                return
              }
            })
        } else {
          console.log('error submit')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: url('/img/login-bg.jpg') no-repeat 0 0;
  background-size: 100% 100%;
  text-align: center;
  main {
    margin: auto;
    > div {
      margin-top: 62px;
      width: 905px;
      height: 425px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      .logo {
        float: left;
        margin: 0 60px;
        width: 330px;
        > img {
          margin-top: 40px;
          display: inline-block;
          width: 100%;
        }
        > p {
          padding-top: 7px;
          width: 100%;
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
      > form {
        float: left;
        margin: 32px 0;
        padding-left: 51px;
        border-left: 1px solid rgba(0, 0, 0, 0.16);
        width: 360px;
        height: 362px;
        img {
          margin: 48px auto 30px;
          display: block;
          width: 292px;
          height: 78px;
        }
        .el-form-item__content {
          margin-left: 30px;
          width: 330px;
        }
        .username,
        .pwd {
          position: relative;
          height: 30px;
        }
        .pwd {
          margin-top: 20px;
        }
        .username:before,
        .pwd:before {
          position: absolute;
          top: 10px;
          left: 0;
          content: '.';
          display: inline-block;
        }
        .username:before {
          width: 20px;
          height: 20px;
          text-indent: -9999px;
          background: url('/img/username.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
        .pwd:before {
          width: 20px;
          height: 20px;
          text-indent: -9999px;
          background: url('/img/pwd.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
        .el-input__inner {
          padding: 0;
          height: 26px;
          line-height: 26px;
          border: 0 none;
          border-radius: 0;
          border-bottom: 1px solid #979797;
        }
        .forget {
          float: right;
          margin-top: -14px;
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
        }
        button {
          width: 330px;
          height: 40px;
        }
      }
    }
    > p {
      margin-top: 43px;
      text-align: center;
      width: 100%;
      height: 19px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.58);
      line-height: 19px;
    }
  }
}
</style>
