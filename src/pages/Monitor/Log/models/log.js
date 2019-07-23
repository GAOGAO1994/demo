import { queryLogList, queryLog, removeLog, addLog, updateLog } from '../services/log';

export default {
  namespace: 'log',

  state: {
    data: {
      items: [],
      total: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryLogList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(queryLog, payload);
      if (response) {
        yield put({
          type: 'saveOne',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addLog, payload);
      if (response && callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeLog, payload);
      if (response && callback) callback();
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateLog, payload);
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
