const getDefaultState = () => {
  return {
    detailbackurl: '',
    detailbackorgid: '',
    detailbackorgname: '',
    editbacklist: [],
    editbackurl: '',
    editbackorgid: '',
    editbackorgname: '',

    backType: '',
  };
};
const state = getDefaultState ();
const getters = {
  detailbackurl: state => state.detailbackurl,
  detailbackorgid: state => state.detailbackorgid,
  detailbackorgname: state => state.detailbackorgname,
  editbackurl: state => state.editbackurl,
  editbackorgid: state => state.editbackorgid,
  editbackorgname: state => state.editbackorgname,
  backType: state => state.backType,
};
const mutations = {
  SET_DETAILBACKURL: (state, data) => (state.detailbackurl = data),
  SET_DETAILBACKORGID: (state, data) => (state.detailbackorgid = data),
  SET_DETAILBACKORGNAME: (state, data) => (state.detailbackorgname = data),
  SET_EDITBACKURL: (state, data) => (state.editbackurl = data),
  SET_EDITBACKORGID: (state, data) => (state.editbackorgid = data),
  SET_EDITBACKORGNAME: (state, data) => (state.editbackorgname = data),
  SET_BACKTYPE: (state, data) => (state.backType = data),
};
const actions = {
  setdetailbackurl: ({commit}, data) => commit ('SET_DETAILBACKURL', data),
  setdetailbackorgid: ({commit}, data) => commit ('SET_DETAILBACKORGID', data),
  setdetailbackorgname: ({commit}, data) =>
    commit ('SET_DETAILBACKORGNAME', data),
  seteditbackurl: ({commit}, data) => commit ('SET_EDITBACKURL', data),
  seteditbackorgid: ({commit}, data) => commit ('SET_EDITBACKORGID', data),
  seteditbackorgname: ({commit}, data) => commit ('SET_EDITBACKORGNAME', data),
  setbacktype: ({commit}, data) => commit ('SET_BACKTYPE', data),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
