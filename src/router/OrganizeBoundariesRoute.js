const LayoutView = () =>
  import ('../views/organize-boundaries-views/LayoutView.vue');

export default {
  path: '/word',
  component: LayoutView,
  children: [
    {
      path: 'word-list',
      name: 'wordList',
      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/word/wordList.vue'
        ),
      meta: {keepAlive: false},
    },
  ],
};