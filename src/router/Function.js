const LayoutView = () =>
	import('../views/organize-boundaries-views/LayoutView.vue');

export default {
	path: '/export',
	component: LayoutView,
	children: [{
		path: 'raw-data-export',
		name: 'rawDataExport',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/RawDataExport.vue'
			),
		meta: {
			keepAlive: true
		},
	},
	{
		path: 'raw-data-table',
		name: 'rawDataTable',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/RawDataTable.vue'
			),
	},
	{
		path: 'raw-con-data-export',
		name: 'rawConDataExport',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/RawConDataExport.vue'
			),
		meta: {
			keepAlive: true
		},
	},
	{
		path: 'raw-con-data-table',
		name: 'rawConDataTable',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/RawConDataTable.vue'
			),
	},
	{
		path: 'original-data-table',
		name: 'originalDataTable',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/OriginalDataTable.vue'
			),
	},
	{
		path: 'concept-data-table',
		name: 'conceptDataTable',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/ConceptDataTable.vue'
			),
	},
	{
		path: 'merge-data-export',
		name: 'mergeDataExport',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/MergeDataExport.vue'
			),
		meta: {
			keepAlive: true
		},
	},
	{
		path: 'merge-data-table',
		name: 'mergeDataTable',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/function/MergeDataTable.vue'
			),
	},
	{
		path: 'bidata',
		name: 'bidata',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/BI/BIdata.vue'
			),
		meta: { keepAlive: false },
	},
	{
		path: 'word-list',
		name: 'wordList',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/word/wordList.vue'
			),
		meta: { keepAlive: false },
	},
	],
};
