export default {
  addTabs ({commit}, data) {
    commit ('addTabs', data);
  },
  closeTabs ({commit}, data) {
    commit ('closeTabs', data);
  },
  changeIsNav({commit}) {
    commit ('changeIsNav');
  },
  changeMenuList({commit}) {
    commit ('changeMenuList');
  },
};
