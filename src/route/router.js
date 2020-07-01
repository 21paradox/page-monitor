import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { mapTree } from 'amis/lib/utils/helper';
import { PATH_PREFIX } from '../constants';

const navCfg = [
  {
    label: '导航',
    children: [
      // {
      //   path: 'dashboard',
      //   label: 'Dashboard',
      //   icon: 'glyphicon glyphicon-signal',
      //   component: lazy(() => import('../pages/Test')),
      // },
      // {
      //   label: '表单页面',
      //   icon: 'glyphicon glyphicon-btc',
      //   children: [
      //     {
      //       label: '常规表单',
      //       path: 'form/basic',
      //       component: lazy(() => import('../pages/FormExample')),
      //     },
      //   ],
      // },
      {
        label: '监控配置',
        icon: 'glyphicon glyphicon-link',
        children: [
          {
            label: 'url配置',
            path: 'pageurl-manage',
            component: lazy(() => import('../pages/PageMonitor/pageurl')),
          },
          {
            label: 'job配置',
            path: 'page-cron',
            component: lazy(() => import('../pages/PageMonitor/cronjob')),
          },
          {
            label: 'url图表',
            path: 'page-chart',
            hide: true,
            component: lazy(() => import('../pages/PageMonitor/pageChart')),
          },
        ],
      },
    ],
  },
];

function navigations2route(pathPrefix = PATH_PREFIX) {
  const routes = [];

  navCfg.forEach((root) => {
    if (root.children) {
      mapTree(root.children, (item) => {
        if (item.path && item.component) {
          routes.push(
            <Route
              key={routes.length + 1}
              path={item.path[0] === '/' ? item.path : `${pathPrefix}/${item.path}`}
              component={item.component}
              exact
            />,
          );
        }
      });
    }
  });

  return routes;
}

function PageRouter() {
  return (
    <Suspense fallback={<div className="ui active loader" />}>
      <Switch>{navigations2route()}</Switch>
    </Suspense>
  );
}
export { PageRouter, navCfg };
