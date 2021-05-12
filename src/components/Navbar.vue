<template>
  <nav :class="show ? 'show' : ''">
    <header>
      <svg class="icon"
           aria-hidden="true">
        <use xlink:href="#iconicon_map_leftboard_shouqi"></use>
      </svg>
      <Logo></Logo>
    </header>
    <div class="nav-list">
      <ul class="outer-ul">
        <li v-for="(item, i) in nav"
            :key="i">
          <h3>
            <a href="javascript:void(0);"
               @click.stop="fn1(item.menuName, item.url)"
               :class="item.open == 1 ? 'cur' : ''">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
              <span>{{ item.menuName }}</span>
            </a>
          </h3>
        </li>
        <!-- <li v-for="(item, i) in nav"
            :key="i">
          <h3>
            <a href="javascript:void(0);"
               @click.stop="toChannelA(item.menuName)">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
              <span>{{ item.menuName }}</span>
              <i class="el-icon-arrow-down"></i>
            </a>
          </h3>
          <ul class="sub-ul">
            <li v-for="(subItem, j) in item.list"
                :key="j">
              <h4>
                <a :class="subItem.cur ? 'cur' : ''"
                   href="javascript:void(0);"
                   @click.stop="toChannelB(item.menuName, subItem.menuName)">
                  <svg class="icon"
                       aria-hidden="true">
                    <use xlink:href="#iconicon_dash"></use>
                  </svg>
                  <span>{{ subItem.menuName }}</span>
                  <i v-if="subItem.url == '' || subItem.url == null"
                     class="el-icon-arrow-down"></i>
                </a>
              </h4>
              <ul class="sub-ul"
                  v-show="subItem.open">
                <li v-for="(minItem, k) in subItem.list"
                    :key="k">
                  <h5>
                    <a :class="minItem.cur ? 'cur' : ''"
                       href="javascript:void(0);"
                       @click.stop="
                        toChannelC(
                          item.menuName,
                          subItem.menuName,
                          minItem.menuName,
                          minItem.url
                        )
                      ">
                      {{ minItem.menuName }}
                    </a>
                  </h5>
                </li>
              </ul>
            </li>
          </ul>
        </li> -->
      </ul>
    </div>
  </nav>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Logo from '@/components/Logo.vue'
export default {
  name: 'Navbar',
  components: {
    Logo
  },
  computed: mapState(['show']),
  data() {
    return {
      nav: JSON.parse(window.localStorage.getItem('menuList'))
    }
  },
  mounted() {
    this.currentNav()
  },
  methods: {
    ...mapActions(['changeMenuList']),
    fn1(name, url) {
      this.nav.map((item, i) => {
        this.nav[i].open = 0
        if (item.menuName == name) {
          this.nav[i].open = 1
        }
      })
      window.localStorage.setItem('menuList', JSON.stringify(this.nav))
      setTimeout(() => {
        var f = false
        var a = JSON.parse(window.sessionStorage.getItem('pages'))
        a.map(item => {
          if (item.link.includes(url) && item.isPathNameCheck) {
            f = true
            location.href = item.link
            return
          }
        })
        if (!f) {
          setTimeout(() => {
            this.$router.push(url)
          }, 0)
        }
      }, 0)
      this.$router.push(url)
    },
    currentNav() {
      let a = window.location.pathname.split('/')[1]
      let b = window.location.pathname.split('/')[2]
      this.nav.map((item, i) => {
        if (item.name == a) {
          item.list.map((ele, j) => {
            this.nav[i].list[j].cur = 0
            if (ele.url && (ele.name == b || ele.name == '')) {
              this.nav[i].list[j].cur = 1
            } else {
              if (ele.list) {
                ele.list.map((sle, k) => {
                  this.nav[i].list[j].list[k].cur = 0
                  if (sle.name == a || sle.name == b) {
                    this.nav[i].list[j].list[k].cur = 1
                  }
                })
              }
            }
          })
        }
      })
      setTimeout(() => {
        this.changeMenuList()
      }, 100)
    },
    fn(url) {
      this.nav.map((item, i) => {
        this.nav[i].cur = 0
        item.list.map((sItem, j) => {
          this.nav[i].list[j].cur = 0
          if (sItem.list) {
            sItem.list.map((tItem, k) => {
              this.nav[i].list[j].list[k].cur = 0
            })
          }
        })
      })
      window.localStorage.setItem('menuList', JSON.stringify(this.nav))
      setTimeout(() => {
        var f = false
        var a = JSON.parse(window.sessionStorage.getItem('pages'))
        a.map(item => {
          if (item.link.includes(url) && item.isPathNameCheck) {
            f = true
            // this.$router.push(item.link)
            location.href = item.link
            return
          }
        })
        if (!f) {
          setTimeout(() => {
            this.$router.push(url)
          }, 0)
        }
      }, 0)
    },
    toChannelA(name) {
      this.nav.map((item, i) => {
        if (item.menuName == name) {
          this.nav[i].open = item.open == 1 ? 0 : 1
        }
      })
    },
    toChannelB(name, secName) {
      this.nav.map((item, i) => {
        if (item.menuName == name) {
          item.list.map((secItem, j) => {
            if (secItem.menuName == secName) {
              this.nav[i].list[j].open = secItem.open == 1 ? 0 : 1
              if (secItem.url) {
                switch (secItem.url) {
                  case '/index/page/user':
                    this.fn('/oauth/user')
                    break
                  case '/index/page/role':
                    this.fn('/oauth/role')
                    break
                  case '/index/page/menu':
                    this.fn('/oauth/menu-resource')
                    break
                  default:
                    this.fn(secItem.url)
                }
              }
            }
          })
        }
      })
    },
    toChannelC(name, secName, thridName, url) {
      this.fn(url)
    }
  }
}
</script>
<style scoped lang="scss">
nav {
  position: absolute;
  width: 0px;
  height: 100vh;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 10000;
  background: #001529;
  color: rgba(255, 255, 255, 1);
  transition: width 0.3s;
  -moz-transition: width 0.3s; /* Firefox 4 */
  -webkit-transition: width 0.3s; /* Safari and Chrome */
  -o-transition: width 0.3s;
  header {
    width: 205px;
    height: 48px;
    .icon {
      float: left;
      font-size: 18px;
      margin: 15px 10px 15px 12px;
    }
  }
  .nav-list {
    width: 205px;
    height: 93vh;
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
  }
  ::-webkit-scrollbar-track {
    background: #001529;
  }
  .outer-ul {
    li {
      margin-top: 8px;
      h3 {
        height: 40px;
        > a {
          display: block;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          .icon {
            padding: 14px 9px 0 12px;
          }
          i {
            float: right;
            margin: 0;
            padding: 12px 14px 0 12px;
            width: 12px;
            height: 12px;
            display: block;
          }
        }
        > a:hover,
        > a.cur {
          background: #7909c1;
        }
      }
      ul.sub-ul li {
        margin-top: 0;
        padding-top: 4px;
        background: #000c17;
        h4 {
          a {
            padding-left: 25px;
            display: block;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            font-weight: 400;
            color: #fff;
            .icon {
              padding-right: 6px;
              // padding: 15px 6px 15px 25px;
            }
            span {
            }
            i {
              float: right;
              margin: 0;
              padding: 12px 14px 0 12px;
              width: 12px;
              height: 12px;
              display: block;
            }
          }
          a.cur,
          a:hover {
            background: #4e19a0;
          }
        }
        h5 {
          // padding-left: 54px;
          a {
            padding-left: 54px;
            display: block;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            font-weight: 400;
            color: #fff;
            .icon {
              padding-right: 6px;
              // padding: 15px 6px 15px 25px;
            }
            span {
            }
            i {
              float: right;
              margin: 0;
              padding: 12px 14px 0 12px;
              width: 12px;
              height: 12px;
              display: block;
            }
          }
          a.cur,
          a:hover {
            background: #4e19a0;
          }
        }
      }
    }
  }
}
nav.show {
  width: 205px;
}
</style>
