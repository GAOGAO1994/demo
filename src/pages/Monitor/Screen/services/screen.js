import request from '@/utils/request';

export async function queryGroupList(params) {
  return request('/api/v1/query/dashboard_groups', { params });
}

export async function addGroup(params) {
  return request('/api/v1/dashboard_groups', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeGroupOrScreenGraphs(params) {
  return request('/api/v1/delete/dashboard_groups', {
    method: 'DELETE',
    params,
  });
}

export async function removeScreen(params) {
  return request(`/api/v1/dashboard_groups/${params.id}`, {
    method: 'DELETE'
  });
}

export async function updateGroup(params = {}) {
  return request(`/api/v1/dashboard_groups/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function queryGraphList(params) {
  return request('/api/v1/graph/dashboard_groups', { params });
}

export async function addGraph(params) {
  return request('/api/v1/operate/dashboard_graphs', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeGraph(params) {
  return request(`/api/v1/dashboard_graphs/${params.id}`, {
    method: 'DELETE'
  });
}

export async function updateGraph(params = {}) {
  return request(`/api/v1/dashboard_graphs/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
