<template>
  <div class="home">
    <header>
      <div class="trigger-nav"
           @click="changeIsNav()">
        <i class="grid-btn"></i>
        <Navbar :key="$route.fullPath" />
      </div>
      <Logo></Logo>
      <Tab :tabs="tabs"></Tab>
      <div class="right-operate">
        <!-- <el-tooltip class="item"
                    effect="dark"
                    content="消息通知"
                    placement="bottom">
          <i class="el-icon-bell cursor"
             @click="toMessage()"><i class="icon-Box"
               v-if="notReadTotal > 0">{{
              notReadTotal
            }}</i></i>
        </el-tooltip> -->
        <a href="javascript:void(0);"
           class="user"
           @click="isUserOperate = !isUserOperate">
          {{ userName }}
        </a>
        <div class="user-operate"
             v-show="isUserOperate">
          <i></i>
          <ul>
            <li>
              <a href="javascript:void(0);"
                 class="info"
                 @click="goInfo"
                 style="height: auto">
                <img src="/img/wdzh_tx.png"
                     alt="" />
                <div>
                  <p class="userName">{{ userName }}</p>
                  <p class="department"
                     v-if="dept">{{ dept }}</p>
                </div>
              </a>
            </li>
            <li>
              <a href="javascript:void(0);"
                 @click="goInfo">
                <svg class="icon"
                     aria-hidden="true">
                  <use xlink:href="#iconicon_gerenxinxi"></use>
                </svg>个人信息</a>
            </li>
            <li>
              <a href="javascript:void(0);"
                 @click="goPass">
                <svg class="icon"
                     aria-hidden="true">
                  <use xlink:href="#iconicon_xiugaimima"></use>
                </svg>修改密码</a>
            </li>
            <li>
              <a href="javascript:void(0);"
                 @click="logout">
                <svg class="icon"
                     aria-hidden="true">
                  <use xlink:href="#iconicon-tuichu"></use>
                </svg>退出</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main>
      <!-- <router-view /> -->
      <keep-alive>
        <router-view class="keep-view"
                     v-if="$route.meta.keepAlive"
                     :key="$route.fullPath"></router-view>
      </keep-alive>
      <router-view class="view"
                   v-if="!$route.meta.keepAlive"></router-view>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters, mapActions } from 'vuex'
// import { mixin } from '@/util'
import { logout } from '@/util'
import Navbar from '@/components/Navbar.vue'
import Logo from '@/components/Logo.vue'
import Tab from '@/components/Tab.vue'
export default {
  // mixins: [mixin],
  name: 'Home',
  components: {
    Navbar,
    Logo,
    Tab
  },
  data() {
    return {
      userName: this.$cookies.get('userName'),
      dept: this.$cookies.get('userInfo').dept,
      channnelName: '',
      isUserOperate: false,
      notReadTotal: ''
    }
  },
  computed: {
    ...mapState({ tabs: 'tabs', readTotal: 'readTotal' }),
    ...mapGetters('common', ['currentMessage', 'messageUnRead'])
  },
  beforeMount() {
    if (!this.userName) {
      location.replace('/login')
    }
    const arr = window.location.pathname.split('/')
    this.urlAStr = arr[1]
    this.urlBStr = arr[2]
    if (
      this.urlAStr == 'organize-boundaries' ||
      this.urlAStr == 'business-navigate' ||
      this.urlAStr == 'route-planning'
    ) {
      const n = JSON.parse(window.localStorage.getItem('menuList'))
      var o = n.filter(item => {
        return item.name == this.urlAStr
      })[0]
      this.channnelName = o.menuName
    }
  },
  mounted() { },
  watch: {
    currentMessage() {
      if (this.currentMessage) {
        this.notReadTotal = this.messageUnRead
      }
    }
  },
  methods: {
    ...mapActions(['changeIsNav']),
    // toMessage() {
    //   this.$router.push('/message-list')
    // },
    goInfo() {
      let type = 'info'
      this.$router.push({
        path: '/account',
        query: {
          type: type
        }
      })
    },
    goPass() {
      let type = 'pass'
      this.$router.push({
        path: '/account',
        query: {
          type: type
        }
      })
    },
    logout() {
      this.$fetch.post('/user-api/sys/user/info/logout').then(res => {
        if (res.code == 200) {
          logout()
          setTimeout(() => {
            window.location.replace('/login')
          }, 100)
        } else {
          console.log('登出失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a2757;
  header {
    display: flex;
    height: 48px;
    background: #0a2757;
    .trigger-nav {
      vertical-align: middle;
      line-height: 48px;
      > i {
        margin: 12px 8px 0 8px;
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url('/img/home/grid-btn.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    h2 {
      // width: 240px;
      img {
        float: left;
        margin: 12px 10px 0 0;
        display: inline-block;
        width: 28px;
        height: auto;
      }
      > span {
        float: left;
        padding-right: 37px;
        margin-top: 12px;
        height: 25px;
        line-height: 25px;
        text-align: left;
        display: flex;
        flex-direction: column;
        span {
          flex: 1;
          padding-right: 8px;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }
        em {
          flex: 1;
          width: 100%;
          line-height: 23px;
          font-size: 14px;
          font-weight: 600;
          font-style: normal;
          color: rgba(255, 255, 255, 1);
        }
      }
      > span.isChannel {
        margin-top: 0;
        height: auto;
      }
    }
    .tab {
      flex: 1;
    }
    .right-operate {
      text-align: right;
      padding: 10px 12px 0 7px;
      height: 28px;
      i.el-icon-bell {
        position: relative;
        margin-right: 8px;
        display: inline-block;
        width: 28px;
        height: 28px;
        padding-top: 4px;
        vertical-align: middle;
        text-align: center;
        font-size: 16px;
        color: #fff;
        font-weight: bold;
      }
      .user {
        float: right;
        display: inline-block;
        padding: 5px 0;
        overflow: hidden;
        width: 28px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background: #19be6b;
        border-radius: 25px;
      }
      .use:hover {
        text-decoration: none;
      }
      .user-operate {
        i {
          position: absolute;
          z-index: 10000;
          top: 40px;
          right: 20px;
          position: absolute;
          width: 0;
          height: 0;
          border: 6px solid;
          border-color: transparent transparent #0a2757;
        }
        ul {
          position: absolute;
          z-index: 10000;
          top: 51px;
          right: 0;
          width: 160px;
          background: #0a2757;
          border-radius: 3px;
          overflow: hidden;
          li {
            a {
              display: block;
              padding: 6px 0 7px 17px;
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 17px;
              text-align: left;
              .icon {
                width: 12px;
                height: 12px;
                margin-right: 13px;
              }
            }
            a:hover {
              background: #133773;
            }
          }
          .info {
            display: flex;
            img {
              width: 40px;
              height: 40px;
            }
            > div {
              flex: 1;
              padding-left: 10px;
              display: flex;
              flex-direction: column;
            }
            .userName {
              color: #fff;
              font-size: 16px;
              flex: 1;
            }
          }
        }
      }
    }
  }
  main {
    flex: 1;
    background: #fff;
    display: flex;
    overflow: hidden;
  }
}
.icon-Box {
  width: 20px !important;
  height: 20px !important;
  background-color: #ed3f14;
  color: #fff;
  position: absolute;
  top: -6px !important;
  right: -3px !important;
  text-align: center;
  line-height: 20px !important;
  border-radius: 10px;
  // z-index: 100;
  font-size: 10px !important;
  transform: scale(0.7);
  cursor: pointer;
}
.cursor {
  cursor: pointer;
}
</style>
