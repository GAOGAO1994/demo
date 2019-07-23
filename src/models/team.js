import { queryTeamList, queryTeam, removeTeam, addTeam, updateTeam } from '../services/team';

export default {
  namespace: 'team',

  state: {
    data: {
      items: [],
      total: 0,
    },
    teamList: {
      items: [],
      total: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTeamList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *fetchSimpleList({ payload }, { call, put }) {
      const response = yield call(queryTeamList, payload);
      if (response) {
        yield put({
          type: 'saveTeamList',
          payload: response,
        });
      }
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(queryTeam, payload);
      if (response) {
        yield put({
          type: 'saveOne',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addTeam, payload);
      if (response && callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeTeam, payload);
      if (response && callback) callback();
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateTeam, payload);
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
    saveTeamList(state, action) {
      return {
        ...state,
        teamList: action.payload,
      };
    },
  },
};
