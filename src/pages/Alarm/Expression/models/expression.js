import {
  queryExpressionList,
  queryExpression,
  removeExpression,
  addExpression,
  updateExpression,
} from '../services/expression';

export default {
  namespace: 'expression',

  state: {
    data: {
      items: [],
      total: 0,
    },
    expression: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryExpressionList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(queryExpression, payload);
      if (response) {
        yield put({
          type: 'saveOne',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addExpression, payload);
      if (response && callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeExpression, payload);
      if (response && callback) callback();
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateExpression, payload);
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
    saveOne(state, action) {
      return {
        ...state,
        expression: action.payload,
      };
    },
  },
};
