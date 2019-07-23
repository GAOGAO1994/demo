import request from '@/utils/request';

export async function querySystemList(params) {
  return request('/api/v1/query/sys_monitor', { params });
}

export async function querySystemChart(params) {
  return request('/api/v1/graph/sys_monitor', { params });
}
