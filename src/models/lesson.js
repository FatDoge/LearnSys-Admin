import { fetchLessonsList } from '@/services/lesson';
import { uploadLesson } from '@/services/api';

export default {
  namespace: 'lesson',

  state: {
    list: []
  },

  effects: {
    *fetch({ payload, callback }, { call }) {
      console.log(payload)
      const res = yield call(fetchLessonsList, payload)
      if (typeof callback === 'function') callback(res);
    },
    *updateLesson({ payload, callback }, { call }) {
      const res = yield call(uploadLesson, payload)
      if (typeof callback === 'function') callback(res);
    },
  },

  reducers: {

  },
};
