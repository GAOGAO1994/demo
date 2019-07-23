export default [
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // monitor
      // { path: '/', redirect: '/monitor/api', authority: ['admin', 'user'] },
      { path: '/', redirect: '/monitor/api' },
      { path: '/monitor', redirect: '/monitor/api' },
      {
        path: '/monitor',
        name: 'monitor',
        icon: 'monitor',
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/monitor/api',
            name: 'api',
            component: './Monitor/Api/ApiList',
            // hideInBreadcrumb: true,
            // routes: [
            //   {
            //     path: '/monitor/api/newapi',
            //     name: '新建API监控',
            //     component: './Monitor/NewApi/NewApi',
            //     // hideInMenu: true,
            //     exact: true,
            //   },
            // ]
          },
          {
            path: '/monitor/api/newapi',
            name: '新建API监控',
            component: './Monitor/NewApi/NewApi',
            hideInMenu: true,
          },
          {
            path: '/monitor/log',
            name: 'log',
            component: './Monitor/Log/LogList',
          },
          {
            path: '/monitor/system',
            name: 'system',
            component: './Monitor/System/SystemList',
          },
          {
            path: '/monitor/custom',
            name: 'custom',
            component: './Monitor/Custom/CustomList',
          },
          {
            path: '/monitor/screen',
            name: 'screen',
            component: './Monitor/Screen/ScreenList',
          },
        ],
      },
      // alarm
      {
        name: 'alarm',
        icon: 'notification',
        icon: 'bell',
        path: '/alarm',
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/alarm/expression',
            name: 'expression',
            component: './Alarm/Expression/ExpressionList',
          },
          {
            path: '/alarm/expression/add',
            name: 'expression.add',
            component: './Alarm/Expression/AddExpression',
            hideInMenu: true,
          },
          {
            path: '/alarm/expression/edit/:id',
            name: 'expression.edit',
            component: './Alarm/Expression/AddExpression',
            hideInMenu: true,
          },
          {
            path: '/alarm/case',
            name: 'case',
            component: './Alarm/Case/CaseList',
          },
          {
            path: '/alarm/team',
            name: 'team',
            component: './Alarm/Team/TeamList',
          },
        ],
      },
      // manual
      {
        name: 'manual',
        icon: 'read',
        // path: '/manual',
        path: '/api/v1/doc',
        target: '_blank', // 点击新窗口打开
        component: './Manual/Manual',
      },
      // user
      {
        name: 'user',
        icon: 'user',
        path: '/user/center',
        component: './User/Center',
      },
      {
        component: '404',
      },
    ],
  },
];
