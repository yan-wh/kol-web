import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/account/users');
}

export async function queryCurrent() {
  return request('/account/me');
}

export async function accountLogin(params) {
  return request('/account/login', {
    method: 'POST',
    body: {
      username: params.username,
      password: params.password,
    },
  });
}

export async function menus(params) {
  const condition = stringify(params) ? `?${stringify(params)}` : '';
  return request(`/menu/authz/ncov/menus${condition}`);
}
