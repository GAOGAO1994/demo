import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryUser() {
  return request('/api/v1/user/me');
}

export async function updateUser(params = {}) {
  const { im, email } = params;
  return request('/api/v1/user/me', {
    method: 'PUT',
    data: {
      im,
      email,
    },
  });
}

export async function queryUserList(params = {}) {
  return request('/api/v1/user', { params });
}
