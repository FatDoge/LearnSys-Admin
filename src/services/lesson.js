import request from '@/utils/request';
import { API_URL } from '@/utils/constant';
import { stringify } from 'qs';


// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

export async function fetchLessonsList(params) {
  return request(`${API_URL}/fetchLessonsList?${stringify(params)}`).then(res => res.results);
}

/*
* 删除课程，需登录且为教师本人
* @author fatdoge
* */
export async function deleteLesson(params) {
  return request(`${API_URL}/deleteLesson`, {
    method: 'POST',
    data: {
      ...params
    }
  }).then(res => res);
}