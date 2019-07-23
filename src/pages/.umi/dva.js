import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'global', ...(require('D:/WebstormProjects/ai-project/monitor-ui/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('D:/WebstormProjects/ai-project/monitor-ui/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('D:/WebstormProjects/ai-project/monitor-ui/src/models/menu.js').default) });
app.model({ namespace: 'setting', ...(require('D:/WebstormProjects/ai-project/monitor-ui/src/models/setting.js').default) });
app.model({ namespace: 'team', ...(require('D:/WebstormProjects/ai-project/monitor-ui/src/models/team.js').default) });
app.model({ namespace: 'user', ...(require('D:/WebstormProjects/ai-project/monitor-ui/src/models/user.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
