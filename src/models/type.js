import { fetchTypeList, addType } from '@/services/type';

export default {
  namespace: 'type',

  state: {
    list: []
  },

  effects: {
    *fetch({ payload, callback }, { call }) {
      console.log(payload)
      const res = yield call(fetchTypeList, payload)
      if (typeof callback === 'function') callback(res);
    },
    *addType({ payload, callback }, { call }) {
      const res = yield call(addType, payload)
      if (typeof callback === 'function') callback(res);
    },
  },

  reducers: {

  },
};
