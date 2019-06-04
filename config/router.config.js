export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'user'] },
      {
        path: '/dashboard',
        name: '仪表盘',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        path: '/upload',
        name: '上传视频',
        icon: 'upload',
        component: './Upload/Upload',
      },
      {
        path: '/types',
        name: '管理类别',
        icon: 'diff',
        component: './ManageType/List'
      },
      {
        path: '/lessons',
        name: '管理课程',
        icon: 'book',
        component: './ManageLesson/List'
      },
      {
        name: '账户中心',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: '个人信息',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: '设置',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //  editor
      {
        name: '推文运营',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/manage',
            name: '文章管理',
            component: './Editor/GGEditor/Flow/List',
          },
          {
            path: '/editor/create',
            name: '新建文章',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/update/:id',
            component: './Editor/GGEditor/Mind',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
