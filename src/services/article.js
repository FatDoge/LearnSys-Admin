import request from '@/utils/request';
import { API_URL } from '@/utils/constant';
import { stringify } from 'qs';


// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

export async function fetchCurrentArticle(params) {
  return request(`${API_URL}/fetchCurrentArticle?${stringify(params)}`).then(res => res.results);
}

/*
* 删除课程，需登录且为教师本人
* @author fatdoge
* */
export async function uploadArticle(params) {
  return request(`${API_URL}/uploadArticle`, {
    method: 'POST',
    data: {
      ...params
    }
  }).then(res => res);
}

export async function fetchArticleList(params) {
  return request(`${API_URL}/fetchArticleList?${stringify(params)}`).then(res => res.results);
}

/*
* 删除文章，需登录且为教师本人
* @author fatdoge
* */
export async function deleteArticle(params) {
  return request(`${API_URL}/deleteArticle`, {
    method: 'POST',
    data: {
      ...params
    }
  }).then(res => res);
}