import { querySystemList, querySystemChart } from '../services/system';

export default {
  namespace: 'system',

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
      const response = yield call(querySystemList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *fetchChart({ payload, callback }, { call, put }) {
      const response = yield call(querySystemChart, payload);
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
