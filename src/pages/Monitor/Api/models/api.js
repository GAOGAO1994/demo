import { queryApiList, removeApi, addApi, queryApiChart } from '../services/api';

export default {
  namespace: 'api',

  state: {
    data: {
      items: [],
      total: 0,
    },
    chartData: {
      items: [],
      total: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryApiList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addApi, payload);
      if (response && callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeApi, payload);
      if (response && callback) callback();
    },
    *fetchChart({ payload, callback }, { call, put }) {
      const response = yield call(queryApiChart, payload);
      if (response) {
        yield put({
          type: 'saveChartData',
          payload: response,
        });
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveChartData(state, action) {
      return {
        ...state,
        chartData: action.payload,
      };
    },
  },
};
