import {isEqual, getParams} from '@/util';
export default {
  changeIsNav: state => {
    let t = state.show;
    state.show = t == 1 ? 0 : 1;
  },
  changeNav: (state, value) => {
    state.show = value.show;
    state.step = value.step;
  },
  addTabs: (state, value) => {
    let flag = false;
    let t = state.tabs;
    let o = getParams (value.link);
    value.path = o.path;
    value.pam = o.pam;
    value.on = false;
    if (value.isPathNameCheck == undefined) {
      value.isPathNameCheck = false;
    }
    t.map ((item, i) => {
      item.on = false;
      if (item.path == value.path) {
        let c = JSON.parse (JSON.stringify (item.pam));
        let isEqualVal = !value.isPathNameCheck
          ? isEqual (c, value.pam)
          : undefined;
        if (value.isPathNameCheck || (!value.isPathNameCheck && isEqualVal)) {
          flag = true;
          item.on = true;
          if (value.update) {
            t[i].title = value.title !== '*' ? value.title : item.title;
            t[i].link = value.update;
            value.link = value.update;
            let g = getParams (t[i].link);
            t[i].path = g.path;
            t[i].pam = g.pam;
          } else {
            item.title = value.title;
          }
          // state.channelName = setChannelName (value.link);
        }
      }
    });
    if (!flag) {
      value.on = true;
      if (value.update) {
        value.link = value.update;
        value.update = null;
      }
      let u = getParams (value.link);
      value.path = u.path;
      value.pam = u.pam;
      t.push (value);
    }
    // state.channelName = setChannelName (value.link);
    state.tabs = t;
    window.sessionStorage.setItem ('pages', JSON.stringify (state.tabs));
  },
  clickTabs: (state, value) => {
    state.tabs.map (v => {
      let o = getParams (v.link);
      v.on = false;
      if (o.path == value.clc.path && isEqual (o.pam, value.clc.query)) {
        v.on = true;
      }
    });
  },
  closeTabs: (state, value) => {
    let preLink;
    let t1 = state.tabs.filter ((v, k) => {
      let w = JSON.parse (JSON.stringify (v.pam));
      let y = JSON.parse (JSON.stringify (value.clc.pam));
      var d = isEqual (w, y);
      if (v.path == value.clc.path && d) {
        preLink = state.tabs[k - 1].link || state.tabs[0].link;
      }
      return v.path != value.clc.path || !d;
    });
    state.tabs = t1;
    window.sessionStorage.removeItem ('pages');
    window.sessionStorage.setItem ('pages', JSON.stringify (state.tabs));
    if (
      value.current.path == value.clc.path &&
      isEqual (
        JSON.parse (JSON.stringify (value.current.pam)),
        JSON.parse (JSON.stringify (value.clc.pam))
      )
    ) {
      location.replace (preLink);
    }
  },
  getUserInfo: (state, value) => {
    state.user = {};
    state.user = value;
  },
  changeMenuList: (state, value) => {
    state.menuList = [];
    state.menuList = value;
  },
  SET_READTOTAL: (state, value) => {
    state.readTotal = value;
  },
};
