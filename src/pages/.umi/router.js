import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from 'D:/WebstormProjects/ai-project/monitor-ui/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    "path": "/",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "routes": [
      {
        "path": "/",
        "redirect": "/monitor/api",
        "exact": true
      },
      {
        "path": "/monitor",
        "redirect": "/monitor/api",
        "exact": true
      },
      {
        "path": "/monitor",
        "name": "monitor",
        "icon": "monitor",
        "hideInBreadcrumb": true,
        "routes": [
          {
            "path": "/monitor/api",
            "name": "api",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Monitor__Api__models__api.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Monitor/Api/models/api.js').then(m => { return { namespace: 'api',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Monitor__Api__ApiList" */'../Monitor/Api/ApiList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Monitor/Api/ApiList').default,
            "exact": true
          },
          {
            "path": "/monitor/api/newapi",
            "name": "新建API监控",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Monitor__NewApi__NewApi" */'../Monitor/NewApi/NewApi'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Monitor/NewApi/NewApi').default,
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/monitor/log",
            "name": "log",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Monitor__Log__models__log.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Monitor/Log/models/log.js').then(m => { return { namespace: 'log',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Monitor__Log__LogList" */'../Monitor/Log/LogList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Monitor/Log/LogList').default,
            "exact": true
          },
          {
            "path": "/monitor/system",
            "name": "system",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Monitor__System__models__system.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Monitor/System/models/system.js').then(m => { return { namespace: 'system',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Monitor__System__SystemList" */'../Monitor/System/SystemList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Monitor/System/SystemList').default,
            "exact": true
          },
          {
            "path": "/monitor/custom",
            "name": "custom",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Monitor__Custom__models__custom.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Monitor/Custom/models/custom.js').then(m => { return { namespace: 'custom',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Monitor__Custom__CustomList" */'../Monitor/Custom/CustomList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Monitor/Custom/CustomList').default,
            "exact": true
          },
          {
            "path": "/monitor/screen",
            "name": "screen",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Monitor__Screen__models__screen.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Monitor/Screen/models/screen.js').then(m => { return { namespace: 'screen',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Monitor__Screen__ScreenList" */'../Monitor/Screen/ScreenList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Monitor/Screen/ScreenList').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('D:/WebstormProjects/ai-project/monitor-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "alarm",
        "icon": "bell",
        "path": "/alarm",
        "hideInBreadcrumb": true,
        "routes": [
          {
            "path": "/alarm/expression",
            "name": "expression",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Alarm__Expression__models__expression.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Alarm/Expression/models/expression.js').then(m => { return { namespace: 'expression',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Alarm__Expression__ExpressionList" */'../Alarm/Expression/ExpressionList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Alarm/Expression/ExpressionList').default,
            "exact": true
          },
          {
            "path": "/alarm/expression/add",
            "name": "expression.add",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Alarm__Expression__models__expression.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Alarm/Expression/models/expression.js').then(m => { return { namespace: 'expression',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Alarm__Expression__AddExpression" */'../Alarm/Expression/AddExpression'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Alarm/Expression/AddExpression').default,
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/alarm/expression/edit/:id",
            "name": "expression.edit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Alarm__Expression__models__expression.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Alarm/Expression/models/expression.js').then(m => { return { namespace: 'expression',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Alarm__Expression__AddExpression" */'../Alarm/Expression/AddExpression'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Alarm/Expression/AddExpression').default,
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/alarm/case",
            "name": "case",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import(/* webpackChunkName: 'p__Alarm__Case__models__case.js' */'D:/WebstormProjects/ai-project/monitor-ui/src/pages/Alarm/Case/models/case.js').then(m => { return { namespace: 'case',...m.default}})
],
      component: () => import(/* webpackChunkName: "p__Alarm__Case__CaseList" */'../Alarm/Case/CaseList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Alarm/Case/CaseList').default,
            "exact": true
          },
          {
            "path": "/alarm/team",
            "name": "team",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Alarm__Team__TeamList" */'../Alarm/Team/TeamList'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Alarm/Team/TeamList').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('D:/WebstormProjects/ai-project/monitor-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "manual",
        "icon": "read",
        "path": "/api/v1/doc",
        "target": "_blank",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Manual__Manual" */'../Manual/Manual'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../Manual/Manual').default,
        "exact": true
      },
      {
        "name": "user",
        "icon": "user",
        "path": "/user/center",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__User__Center" */'../User/Center'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../User/Center').default,
        "exact": true
      },
      {
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__404" */'../404'),
      LoadingComponent: require('D:/WebstormProjects/ai-project/monitor-ui/src/components/PageLoading/index').default,
    })
    : require('../404').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('D:/WebstormProjects/ai-project/monitor-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('D:/WebstormProjects/ai-project/monitor-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
history.listen(routeChangeHandler);
routeChangeHandler(history.location);

export { routes };

export default function RouterWrapper(props = {}) {
  return (
<RendererWrapper0>
          <Router history={history}>
      { renderRoutes(routes, props) }
    </Router>
        </RendererWrapper0>
  );
}
