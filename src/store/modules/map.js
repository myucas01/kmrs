const getDefaultState = () => {
	return {
		mapStyle: 'amap://styles/normal',  // 地图默认风格
		mapHidden: false,    // 地图常规元素
		mapSearch: false,    // 地图搜索
		mapSearchIcon: true,    // 控制地图搜索的功能是否展示
		mapRanging: 'close',    // 地图测距功能
		mapScale: true,         // 地图比例尺
		mapOrganization: true,   // 控制地图组织是否展示
		organizationDisabled: false,    // 地图组织是否可以操作
		organizationId: '0',     // 地图组织ID
		organizationName: '全国',  // 地图组织名称
		orgCheckId: '',  // 地图组织勾选组织
		searchType: ['map', 'org']
	};
};
let map = {
	namespaced: true,
	state: getDefaultState(),
	mutations: {
		SET_MAP_STYLE: (state, data) => {
			state.mapStyle = data;
		},
		SET_MAP_HIDDEN: (state, data) => {
			state.mapHidden = data;
		},
		SET_MAP_SEARCH: (state, data) => {
			state.mapSearch = data;
		},
		SET_MAP_SEARCH_ICON: (state, data) => {
			state.mapSearchIcon = data;
		},
		SET_MAP_RANGING: (state, data) => {
			state.mapRanging = data;
		},
		SET_MAP_SCALE: (state, data) => {
			state.mapScale = data;
		},
		SET_MAP_ORGANIZATION: (state, data) => {
			state.mapOrganization = data;
		},
		SET_ORGANIZATION_DISABLED: (state, data) => {
			state.organizationDisabled = data;
		},
		SET_ORGANIZATION_ID: (state, data) => {
			state.organizationId = data;
		},
		SET_ORGANIZATION_NAME: (state, data) => {
			state.organizationName = data;
		},
		SET_ORG_CHECK_ID: (state, data) => {
			state.orgCheckId = data;
		},
		SET_SEARCH_TYPE: (state, data) => {
			state.searchType = data;
		},
	},
	actions: {
		setMapStyle({
			commit
		}, data) {
			commit('SET_MAP_STYLE', data);
		},
		setMapHidden({
			commit
		}, data) {
			commit('SET_MAP_HIDDEN', data);
		},
		setMapSearch({
			commit
		}, data) {
			commit('SET_MAP_SEARCH', data);
		},
		setMapSearchIcon({
			commit
		}, data) {
			commit('SET_MAP_SEARCH_ICON', data);
		},
		setMapRanging({
			commit
		}, data) {
			commit('SET_MAP_RANGING', data);
		},
		setMapScale({
			commit
		}, data) {
			commit('SET_MAP_SCALE', data);
		},
		setMapOrganization({
			commit
		}, data) {
			commit('SET_MAP_ORGANIZATION', data);
		},
		setOrganizationDisabled({
			commit
		}, data) {
			commit('SET_ORGANIZATION_DISABLED', data);
		},
		setOrganizationId({
			commit
		}, data) {
			commit('SET_ORGANIZATION_ID', data);
		},
		setOrganizationName({
			commit
		}, data) {
			commit('SET_ORGANIZATION_NAME', data);
		},
		setOrgCheckId({
			commit
		}, data) {
			commit('SET_ORG_CHECK_ID', data);
		},
		setSearchType({
			commit
		}, data) {
			commit('SET_SEARCH_TYPE', data);
		},
	},
	getters: {
		mapStyle: state => state.mapStyle,
		mapHidden: state => state.mapHidden,
		mapSearch: state => state.mapSearch,
		mapSearchIcon: state => state.mapSearchIcon,
		mapRanging: state => state.mapRanging,
		mapOrganization: state => state.mapOrganization,
		organizationDisabled: state => state.organizationDisabled,
		organizationId: state => state.organizationId,
		organizationName: state => state.organizationName,
		orgCheckId: state => state.orgCheckId,
		searchType: state => state.searchType,
	},
};

export default map;
