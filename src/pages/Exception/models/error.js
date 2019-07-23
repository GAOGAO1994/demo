import queryError from '@/services/error';

export default {
  namespace: 'error',

  state: {
    error: '',
    isloading: false,
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(queryError, payload.code);
      if (response) {
        yield put({
          type: 'trigger',
          payload: payload.code,
        });
      }
    },
  },

  reducers: {
    trigger(state, action) {
      return {
        error: action.payload,
      };
    },
  },
};
