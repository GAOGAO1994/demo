// import { stringify } from 'qs';
import { queryUser, updateUser, queryUserList } from '@/services/user';
import cookie from 'react-cookies';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    userList: {
      items: [],
      total: 0,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        if (window.location.pathname === '/api/v1/rbac/login') return;
        dispatch({
          type: 'login',
        });
        // dispatch({
        //   type: 'fetch'
        // })
      });
    },
  },

  effects: {
    *login({ payload }, { call, put, select }) {
      const token = cookie.load('RBAC_TOKEN');
      if (!token) {
        window.location.href = `/api/v1/rbac/login?next=${window.location.href}`;
        return;
      }

      const currentUser = yield select(state => state.user.currentUser);
      if (currentUser && currentUser.name) return;

      const response = yield call(queryUser, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
        // localStorage.setItem('currentUser', stringify(response));
      }
    },
    // *logout(_, { put }) {
    //   const {href} = window.location;
    //   window.location.href = `/api/v1/logout?next=${href}`;
    // },
    // *fetch({ payload, callback }, { call, put }) {
    //   const response = yield call(queryUser, payload);
    //   if (response) {
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //     localStorage.setItem('currentUser', stringify(response));
    //     if (callback) callback();
    //   }
    // },
    *updaste({ payload, callback }, { call, put }) {
          const response = yield call(updateUser, payload);
          if (response) {
            yield put({
              type: 'save',
              payload: reponse,
        });
        if (callback) callback();
      }
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      if (response) {
        yield put({
          type: 'saveUserList',
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
        currentUser: action.payload,
      };
    },
    saveUserList(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
