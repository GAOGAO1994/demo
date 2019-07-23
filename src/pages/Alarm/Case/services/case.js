import request from '@/utils/request';

export async function queryCaseList(params) {
  return request('/api/v1/event_cases', { params }); // url 参数自动序列化 & 默认 get 请求
}

export async function removeCase(params) {
  return request(`/api/v1/delete/event_cases?event_cases=${params.id}`, {
    method: 'DELETE'
  });
}
