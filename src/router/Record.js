const LayoutView = () =>
	import('../views/organize-boundaries-views/LayoutView.vue');

export default {
	path: '/record',
	component: LayoutView,
	children: [{
		path: 'index',
		name: 'index',
		component: () =>
			import(
				/* webpackChunkName: "OrganizeBoundariesIndexView" */
				'../views/record/index.vue'
			),
	}]
}