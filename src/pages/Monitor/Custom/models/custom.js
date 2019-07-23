import {
  queryEndpoint,
  removeEndpoint,
  queryCustomList,
  removeMetric,
  queryCustomChart,
} from '../services/custom';

export default {
  namespace: 'custom',

  state: {
    endpointData: {
      items: [],
      total: 0,
    },
    metricData: {
      items: [],
      total: 0,
    },
    chartData: {
      items: [],
      total: 0,
    },
  },

  effects: {
    *fetchEndpoint({ payload }, { call, put }) {
      // 只获取主机列表，暂未用到
      const response = yield call(queryEndpoint, payload);
      if (response) {
        yield put({
          type: 'saveEndpointData',
          payload: response,
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCustomList, payload);
      if (response) {
        yield put({
          type: 'saveData',
          payload: response,
        });
      }
    },
    *fetchEndpointPages({ payload }, { call, put }) {
      const response = yield call(queryCustomList, payload);
      if (response) {
        yield put({
          type: 'saveEndpointData',
          payload: response.endpoints,
        });
      }
    },
    *fetchMetricPages({ payload }, { call, put }) {
      const response = yield call(queryCustomList, payload);
      if (response) {
        yield put({
          type: 'saveMetricData',
          payload: response.metrics,
        });
      }
    },
    *removeEndpoint({ payload, callback }, { call }) {
      const response = yield call(removeEndpoint, payload);
      if (response && callback) callback();
    },
    *removeMetric({ payload, callback }, { call }) {
      const response = yield call(removeMetric, payload);
      if (response && callback) callback();
    },
    *fetchChart({ payload, callback }, { call, put }) {
      const response = yield call(queryCustomChart, payload);
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
    saveEndpointData(state, action) {
      return {
        ...state,
        endpointData: action.payload,
      };
    },
    saveMetricData(state, action) {
      return {
        ...state,
        metricData: action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        endpointData: action.payload.endpoints,
        metricData: action.payload.metrics,
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
