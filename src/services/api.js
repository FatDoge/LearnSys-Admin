import { stringify } from 'qs';
import request, { qiniuRequest } from '@/utils/request';
import { API_URL,qiniuBucket, qiniuUploadServer } from '@/utils/constant';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

/*
* 上传文件 0|文件存储 1|图片存储 2|视频存储 3|音频存储
* @mock http://f2e.dxy.net/mock-api/client/59805e6c5b5f7509a7bbe794
* */
export async function uploadFileI(params) {
  const formData = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return qiniuRequest(qiniuUploadServer, {
    method: 'POST',
    body: formData,
  }).then(res => `${qiniuBucket}/${res.hash}`);
}

/*
* 获取七牛云上传文件授权token
* @author fatdoge
* */
export async function queryUploadToken() {
  return request(`${API_URL}/token`, {
    method: 'POST'
  }).then(res => res.results);
}

/*
* 登录接口
* @author fatdoge
* */
export async function accountLogin(params) {
  return request(`${API_URL}/login`, {
    method: 'POST',
    data: params,
  }).then(res => res);
}

/*
* 登出接口
* @author fatdoge
* */
export async function accountLogout(params) {
  return request(`${API_URL}/logout`, {
    method: 'POST',
    data: params,
  }).then(res => res);
}

/*
* 上传课程接口，前置需拿到七牛云返回的视频地址
* @author fatdoge
* */
export async function uploadLesson(params) {
  return request(`${API_URL}/uploadLesson`, {
    method: 'POST',
    data: params,
  }).then(res => res);
}