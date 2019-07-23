import request from '@/utils/request';

export async function queryExpressionList(params) {
  return request('/api/v1/expression', { params }); // url 参数自动序列化 & 默认 get 请求
}

export async function queryExpression(params) {
  return request.get(`/api/v1/expression/${params.id}`, { params }); // get 请求语法糖
}

export async function removeExpression(params) {
  return request(`/api/v1/expression/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addExpression(params) {
  return request.post('/api/v1/expression', { data: params }); // post 请求语法糖
}

export async function updateExpression(params = {}) {
  return request(`/api/v1/expression/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
