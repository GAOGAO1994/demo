import request from '@/utils/request';

export async function queryTeamList(params) {
  return request('/api/v1/team', { params }); // url 参数自动序列化 & 默认 get 请求
}

export async function queryTeam(params) {
  return request.get(`/api/v1/team/${params.id}`); // get 请求语法糖
}

export async function removeTeam(params) {
  return request(`/api/v1/team/${params.id}`, {
    method: 'DELETE',
  });
}

export async function addTeam(params) {
  return request('/api/v1/operate/team', {
    method: 'POST',
    data: params,
  });
}

export async function updateTeam(params = {}) {
  return request(`/api/v1/operate/team`, {
    method: 'PUT',
    data: params,
  });
}
