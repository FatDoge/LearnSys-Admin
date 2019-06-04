import request from '@/utils/request';
import { API_URL } from '@/utils/constant';
import { stringify } from 'qs';

export async function fetchTypeList(params) {
  return request(`${API_URL}/fetchTypeList?${stringify(params)}`).then(res => res.results);
}

/*
* 删除课程，需登录且为教师本人
* @author fatdoge
* */
export async function deleteType(params) {
  return request(`${API_URL}/deleteType`, {
    method: 'POST',
    data: {
      ...params
    }
  }).then(res => res);
}

/*
* 删除课程，需登录且为教师本人
* @author fatdoge
* */
export async function addType(params) {
  return request(`${API_URL}/addType`, {
    method: 'POST',
    data: {
      ...params
    }
  }).then(res => res);
}