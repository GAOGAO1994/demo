import request from '@/utils/request';

export async function queryApiList(params) {
  return request('/api/v1/query/api_monitor', { params }); // url 参数自动序列化 & 默认 get 请求
}

export async function removeApi(params) {
  return request(`/api/v1/api_monitor_cfg/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addApi(params) {
  return request.post('/api/v1/api_monitor_cfg', { data: params }); // post 请求语法糖
}

export async function queryApiChart(params) {
  return request.get('/api/v1/graph/api_monitor', { params }); // url 参数自动序列化 & get 请求语法糖
}
