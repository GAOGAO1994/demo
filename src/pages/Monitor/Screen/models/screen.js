import {
  queryGroupList,
  addGroup,
  removeGroupOrScreenGraphs,
  removeScreen,
  updateGroup,
  queryGraphList,
  addGraph,
  removeGraph,
  updateGraph,
} from '../services/screen';

export default {
  namespace: 'screen',

  state: {
    groupData: {
      items: [],
      total: 0,
    },
    graphData: {
      items: [],
      total: 0,
    },
    previewData: {
      items: [],
      total: 0,
    },
  },

  effects: {
    *fetchGroups({ payload }, { call, put }) {
      const response = yield call(queryGroupList, payload);
      if (response) {
        yield put({
          type: 'saveGroups',
          payload: response,
        });
      }
    },
    *addGroup({ payload, callback }, { call }) {
      const response = yield call(addGroup, payload);
      if (response && callback) callback();
    },
    *removeGroupOrScreenGraphs({ payload, callback }, { call }) {
      const response = yield call(removeGroupOrScreenGraphs, payload);
      if (response && callback) callback();
    },
    *removeScreen({ payload, callback }, { call }) {
      const response = yield call(removeScreen, payload);
      if (response && callback) callback();
    },
    *updateGroup({ payload, callback }, { call }) {
      const response = yield call(updateGroup, payload);
      if (response && callback) callback();
    },
    *fetchGraphs({ payload }, { call, put }) {
      const response = yield call(queryGraphList, payload);
      if (response) {
        yield put({
          type: 'saveGraphs',
          payload: response,
        });
      }
    },
    *addGraph({ payload, callback }, { call }) {
      const response = yield call(addGraph, payload);
      if (response && callback) callback();
    },
    *previewGraph({ payload, callback }, { call, put }) {
      const response = yield call(addGraph, payload);
      if (response) {
        yield put({
          type: 'savePreviewData',
          payload: response,
        });
        if (callback) callback();
      }
    },
    *removeGraph({ payload, callback }, { call }) {
      const response = yield call(removeGraph, payload);
      if (response && callback) callback();
    },
    *updateGraph({ payload, callback }, { call }) {
      // 更新图配置，暂未使用
      const response = yield call(updateGraph, payload);
      if (response && callback) callback();
    },
  },

  reducers: {
    saveGroups(state, action) {
      return {
        ...state,
        groupData: action.payload,
      };
    },
    saveGraphs(state, action) {
      return {
        ...state,
        graphData: action.payload,
      };
    },
    savePreviewData(state, action) {
      return {
        ...state,
        previewData: action.payload,
      };
    },
  },
};
