import request from '@/utils/request';
import { API_URL } from '@/utils/constant';

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

export async function queryCurrent() {
  return request(`${API_URL}/currentUser`).then(res => res.data);
}