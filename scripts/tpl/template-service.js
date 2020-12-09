import { stringify } from 'qs';
import request from '@/utils/request';

export async function QUERY(payload) {
  const params = stringify(payload).length > 0 ? `?${stringify(payload)}` : '';
  return request(`/crm/customers${params}`);
}

export async function GET({ id }) {
  return request(`/crm/customers/${id}`);
}

export async function POST(payload) {
  return request('/crm/customers', {
    method: 'POST',
    body: {
      ...payload,
    },
  });
}

export async function DEL({ id }) {
  return request(`/crm/customers/${id}`, {
    method: 'DELETE',
  });
}

export async function PUT(payload) {
  return request(`/crm/customers/${payload.id}`, {
    method: 'PUT',
    body: {
      ...payload,
    },
  });
}
