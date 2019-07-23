import { queryCaseList, removeCase } from '../services/case';

export default {
  namespace: 'cases',

  state: {
    data: {
      items: [],
      total: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCaseList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeCase, payload);
      if (response && callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
