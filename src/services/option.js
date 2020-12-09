import request from '@/utils/request';

export async function options() {
  return request('/crm/options');
}
