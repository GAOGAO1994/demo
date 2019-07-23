import request from '@/utils/request';

export async function queryEndpoint(params) {
  return request('/api/v1/endpoint', { params });
}

export async function removeEndpoint(params) {
  return request('/api/v1/delete/endpoint', {
    method: 'DELETE',
    params,
  });
}

export async function queryCustomList(params) {
  return request('/api/v1/search/metric', { params });
}

export async function removeMetric(params) {
  return request('/api/v1/delete/metric', {
    method: 'DELETE',
    params,
  });
}

export async function queryCustomChart(params) {
  return request('/api/v1/graph/general', { params });
}
