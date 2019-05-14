const API_SERVER= {
  domain: 'http://127.0.0.1',
  port: 7001,
  qiniuBucket: 'http://cdn.fatdoge.cn', // 融合CDN地址
  qiniuUploadServer: 'http://upload.qiniup.com', // 七牛云上传区域
}

export const API_URL = `${API_SERVER.domain}:${API_SERVER.port}`;
export const { qiniuBucket, qiniuUploadServer } = API_SERVER;
export const rules = [
  {
    required: true,
    message: '此信息为必填项',
  },
];