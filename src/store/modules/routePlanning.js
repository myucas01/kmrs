const {
  sessionStorage
} = window;
const getDefaultState = () => {
  return {
    NowStep: 'CommonConfig', // 当前 步骤id -> CommonConfig 全局配置 / PlanRoute 划区建线 / Approve 审批生效 / ExportPlan 导出计划
    precincts: sessionStorage.getItem('precincts') ?
      JSON.parse(sessionStorage.getItem('precincts')) :
      '', // 划区 方式
    lineBuilding: sessionStorage.getItem('lineBuilding') ?
      JSON.parse(sessionStorage.getItem('lineBuilding')) :
      '', // 建线方式
    routLineColor: [
      //   路线颜色
      '#C50404',
      '#2716C4',
      '#4C8C06',
      '#4A90E2',
      '#007D86',
      '#83562E',
      '#D0A052',
    ],
    // 图例
    pointVal: 0, // 点位
    jobLayer: ['区域'], //岗位图层
    routeVisit: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], //路线拜访日
    routeStyle: '直线', // 路线样式
    pointNeedData: new Map(), // 批量选点所需要的数据
    draftId: sessionStorage.getItem('draftId') || '', // 草稿计划ID
    mapViewId: sessionStorage.getItem('mapViewId') || '', // 地图可视化 调整/查看 计划id
    currentOrgId: sessionStorage.getItem('currentOrgId') || '', // 当前查看的行销公司ID
    currentOrgName: sessionStorage.getItem('currentOrgName') || '', // 当前查看的行销公司name
    currentServiceName: sessionStorage.getItem('currentServiceName') || '', // 当前服务标准配置名称
    currentServiceId: sessionStorage.getItem('currentServiceId') || '', // 当前服务标准配置ID
    currentServiceType: '', // 'true'/'' 编辑/新增 服务标准配置
    currentServiceDisable: false, // 当前服务标准的表格是否可编辑 true：可编辑 false：不可编辑
    serviceButton: false, // 'true'/'' 是否显示服务日调整按钮
    changeLineButton: true, // 'true'/'' 是否显示线路调整按钮
    operationalService: true, // 'true'/'' 是否进行服务日操作
    visitYear: sessionStorage.getItem('visitYear') || '', // 拜访信息-年份
    visitMonth: sessionStorage.getItem('visitMonth') || '', // 拜访信息-月份
    visitOrgId: sessionStorage.getItem('visitOrgId') || '', // 拜访信息-组织id
    visitOrgName: sessionStorage.getItem('visitOrgName') || '', // 拜访信息-组织名称
    showIds: [], // 当前需要展示地图数据的id
    nowPostId: [],
    currentStoreType: {
      // 当前业代数据
      id: '', // 业代code/id
      routeStatus: '', // 建线状态
    },
    NowWeek: '1', //第几周
    organizePlanStatus: sessionStorage.getItem('organizePlanStatus') || '', // 方案 状态
    planApproveStatus: sessionStorage.getItem('planApproveStatus') || '',  // 方案审批状态
    showRouteType: null, // 是否已生成路线
    noPlanServiceDayStore: '', // 未计划 服务日 门店
    viewMapSalesTypeMap: new Map(),  // 地图可视化  业代类型 数据关系
    saleTypeKey: '', // 地图可视化  业代类型 数据关系 映射数据 便于监听
    updateNoPlanStore: '', // 更新 未计划门店
    Stockpile: false, //存储控制器
  };
};
const state = getDefaultState();
const getters = {
  pointNeedData: state => state.pointNeedData,
  NowStep: state => state.NowStep,
  precincts: state => state.precincts,
  lineBuilding: state => state.lineBuilding,
  routLineColor: state => state.routLineColor,
  draftId: state => state.draftId, // 草稿计划 ID
  currentOrgId: state => state.currentOrgId,
  currentOrgName: state => state.currentOrgName,
  currentServiceName: state => state.currentServiceName,
  currentServiceId: state => state.currentServiceId,
  currentServiceType: state => state.currentServiceType,
  pointVal: state => state.pointVal, // 图例 点位
  jobLayer: state => state.jobLayer, // 图例 岗位
  routeVisit: state => state.routeVisit, // 图例 路线拜访日
  routeStyle: state => state.routeStyle, // 图例 路线 样式
  currentServiceDisable: state => state.currentServiceDisable,
  ServiceButton: state => state.serviceButton,
  changeLineButton: state => state.changeLineButton,
  operationalService: state => state.operationalService,
  visitMonth: state => state.visitMonth, // 年月
  visitOrgId: state => state.visitOrgId, // 组织id
  visitYear: state => state.visitYear,
  visitOrgName: state => state.visitOrgName,
  currentStoreType: state => state.currentStoreType,
  showIds: state => state.showIds,
  NowWeek: state => state.NowWeek,
  nowPostId: state => state.nowPostId,
  mapViewId: state => state.mapViewId,
  organizePlanStatus: state => state.organizePlanStatus,
  planApproveStatus: state => state.planApproveStatus,
  showRouteType: state => state.showRouteType,
  viewMapSalesTypeMap: state => state.viewMapSalesTypeMap,
  saleTypeKey: state => state.saleTypeKey,
  updateNoPlanStore: state => state.updateNoPlanStore,
  Stockpile: state => state.Stockpile
};
const mutations = {
  SET_POINT_NEEDDATA: (state, data) => {
    state.pointNeedData.set(data.id, data.value);
  },
  SET_POINT_CLEAR_NEEDDATA: (state, data) => {
    state.pointNeedData.delete(data.id);
  },
  // 重置
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  // 设置查看当前业代 相关数据
  SET_CURRENT_STORE_TYPE: (state, data) => (state.currentStoreType = data),
  // 设置 当前 步骤
  SET_STEP: (state, data) => {
    state.NowStep = data;
  },
  // 设置当前月份 该组织 计划状态
  SET_ORGANIZE_PLAN_STATUS: (state, data) => {
    sessionStorage.setItem('organizePlanStatus', data);
    state.organizePlanStatus = data;
  },
  // 设置草稿计划 id
  SET_DRAFT_ID: (state, data) => {
    sessionStorage.setItem('draftId', data);
    state.draftId = data;
  },
  // 设置 地图调整/查看 计划id
  SET_MAP_VIEW_ID: (state, data) => {
    sessionStorage.setItem('mapViewId', data);
    state.mapViewId = data;
  },
  // 设置 划区方式
  SET_PRECINCTS: (state, data) => {
    sessionStorage.setItem('precincts', JSON.stringify(data));
    state.precincts = data;
  },
  // 设置 建线方式
  SET_LINE_BUILDING: (state, data) => {
    sessionStorage.setItem('lineBuilding', JSON.stringify(data));
    state.lineBuilding = data;
  },
  // 设置 图例部分数据  点位
  SET_LEGEND_POINT: (state, data) => (state.pointVal = data),
  // 设置 图例部分数据  岗位图层
  SET_LEGEND_JOB_LAYER: (state, data) => (state.jobLayer = data),
  // 设置 图例部分数据  路线拜访日
  SET_LEGEND_ROUTE_VISIT: (state, data) => (state.routeVisit = data),
  // 设置 图例部分数据  路线样式
  SET_LEGEND_ROUTE_STYLE: (state, data) => (state.routeStyle = data),
  // 点击查看当前的行销公司ID
  SET_CURRENT_ORG_ID: (state, data) => {
    sessionStorage.setItem('currentOrgId', data);
    state.currentOrgId = data;
  },
  // 点击查看当前的行销公司name
  SET_CURRENT_ORG_NAME: (state, data) => {
    sessionStorage.setItem('currentOrgName', data);
    state.currentOrgName = data;
  },
  // 设置当前服务标准名称
  SET_CURRENT_SERVICE_NAME: (state, data) => {
    sessionStorage.setItem('currentServiceName', data);
    state.currentServiceName = data;
  },
  // 设置当前服务标准ID
  SET_CURRENT_SERVICE_ID: (state, data) => {
    sessionStorage.setItem('currentServiceId', data);
    state.currentServiceId = data;
  },
  // 设置当前服务标准是新增or编辑
  SET_CURRENT_SERVICE_TYPE: (state, data) => (state.currentServiceType = data),
  // 设置当前服务标准的表格是否可编辑
  SET_CURRENT_SERVICE_DISABLE: (state, data) => {
    state.currentServiceDisable = data;
  },
  // 设置当前服务标准是新增or编辑
  SET_SERVICE_BUTTON: (state, data) => (state.serviceButton = data),
  SET_CHANGELINE_BUTTON: (state, data) => (state.changeLineButton = data),
  SET_OPERATIONAL_SERVICE: (state, data) => (state.operationalService = data),
  // 设置拜访信息-月份、年、组织id、组织名称
  SET_VISIT_YEAR: (state, data) => {
    sessionStorage.setItem('visitYear', data);
    state.visitYear = data;
  },
  SET_VISIT_MONTH: (state, data) => {
    sessionStorage.setItem('visitMonth', data);
    state.visitMonth = data;
  },
  SET_VISIT_ORG_ID: (state, data) => {
    sessionStorage.setItem('visitOrgId', data);
    state.visitOrgId = data;
  },
  SET_VISIT_ORG_NAME: (state, data) => {
    sessionStorage.setItem('visitOrgName', data);
    state.visitOrgName = data;
  },
  SET_SHOWIDS: (state, data) => (state.showIds = data),
  SET_NOWEEk: (state, data) => (state.NowWeek = data),
  SET_NOWPOSTID: (state, data) => (state.nowPostId = data),
  SET_SHOWROUTE: (state, data) => (state.showRouteType = data),
  SET_PLAN_APPROVE_STATUS : (state, data) => {
    sessionStorage.setItem('planApproveStatus', data);
    state.planApproveStatus = data
  },
  SET_VIEW_MAP_SALES_TYPE_MAP: (state, data) => (state.viewMapSalesTypeMap = data),
  STOCK_PILE: (state, data) => (state.Stockpile = data),
  SET_SALE_TYPE_KEY:  (state, data) => (state.saleTypeKey = data),
  // 更新 未计划门店
  SET_UPDATE_NO_PLAN_STORE: (state, data) => (state.updateNoPlanStore = data),
};
const actions = {
  // 重置 state
  reset_state: ({
    commit
  }, data) => {
    commit('RESET_STATE', data);
  },
  // 设置 当前 步骤
  set_step: ({
    commit
  }, data) => {
    commit('SET_STEP', data);
  },
  // 设置 地图调整/查看 计划id
  set_map_view_id: ({
    commit
  }, data) => {
    commit('SET_MAP_VIEW_ID', data);
  },
  // 设置 草稿(预)计划 id
  set_draft_id: ({
    commit
  }, id) => commit('SET_DRAF_ID', id),
  // 修改当前 查看业代类型
  set_current_store_type: ({
      commit
    }, data) =>
    commit('SET_CURRENT_STORE_TYPE', data),
  // 设置 图例部分数据  点位
  setLegendPoint: ({
    commit
  }, data) => commit('SET_LEGEND_POINT', data),
  // 设置 图例部分数据  岗位图层
  setLegendJobLayer: ({
    commit
  }, data) => commit('SET_LEGEND_JOB_LAYER', data),
  // 设置 图例部分数据  路线拜访日
  setLegendRouteVisit: ({
      commit
    }, data) =>
    commit('SET_LEGEND_ROUTE_VISIT', data),
  // 设置 图例部分数据  路线样式
  setLegendRouteStyle: ({
      commit
    }, data) =>
    commit('SET_LEGEND_ROUTE_STYLE', data),
  // 点击查看当前的行销公司ID
  // setCurrentOrgId: ({commit}, data) => commit('SET_CURRENT_ORG_ID', data),
  // 是否显示服务日按钮
  setServiceButton: ({
    commit
  }, data) => commit('SET_SERVICE_BUTTON', data),
  setChangelineButton: ({
    commit
  }, data) => commit('SET_CHANGELINE_BUTTON', data),
  // 是否显示服务日按钮
  setOperationalService: ({
      commit
    }, data) =>
    commit('SET_OPERATIONAL_SERVICE', data),
  setShowRoute: ({
    commit
  }, data) => {
    commit('SET_SHOWROUTE', data);
  },
  setShowIds: ({
    commit
  }, data) => commit('SET_SHOWIDS', data),
  setNowWeek: ({
    commit
  }, data) => commit('SET_NOWEEk', data),
  setnowPostId: ({
    commit
  }, data) => commit('SET_NOWPOSTID', data),
  // 设置当前月份 该组织 计划审批状态
  set_organize_plan_status: ({
    commit
  }, data) => {
    commit('SET_ORGANIZE_PLAN_STATUS', data);
  },
  set_plan_approve_status:  ({
                               commit
                             }, data) => {
    commit('SET_PLAN_APPROVE_STATUS', data);
  },
  set_view_map_sales_type_map: ({commit},data) => {
    commit('SET_VIEW_MAP_SALES_TYPE_MAP', data)
  },
  set_sale_type_key: ({commit},data) => {
    commit('SET_SALE_TYPE_KEY', data)
  },
  // 更新未计划 门店
  set_update_no_plan_store: ({commit},data) => {
    commit('SET_UPDATE_NO_PLAN_STORE', data)
  },
  // 更新互斥状态
  Stock_pile: ({commit},data) => {
    commit('STOCK_PILE', data)
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
