import request from '@/utils/request';

export async function queryLogList(params) {
  return request('/api/v1/log_monitor_cfg', { params }); // url 参数自动序列化 & 默认 get 请求
}

export async function queryLog(params) {
  return request.get(`/api/v1/log_monitor_cfg/${params.id}`); // get 请求语法糖
}

export async function removeLog(params) {
  return request(`/api/v1/log_monitor_cfg/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addLog(params) {
  return request('/api/v1/log_monitor_cfg', {
    method: 'POST',
    data: params,
  });
}

export async function updateLog(params = {}) {
  return request(`/api/v1/log_monitor_cfg/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
