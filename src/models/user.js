import { query as queryUsers, queryCurrent } from '@/services/user';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    status: true,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put, select }) {
      const user = yield select(state => state.user.currentUser);
      const status = yield select(state => state.user.status);
      if (status) {
        yield put({
          type: 'changeStatus',
          payload: {
            status: !status,
          },
        });
        let response = undefined;
        if (localStorage.getItem('token')) {
          response = yield call(queryCurrent);
        } else {
          yield put(routerRedux.push('/user/login'));
          yield window.location.reload();
        }

        if (response && response.hasOwnProperty('user')) {
          const currentUser = {
            name: response.user.name,
            avatar: response.user.avatar,
            userid: response.user.id,
            notifyCount: 0,
          };
          // onsole.log(currentUser)
          yield put({
            type: 'saveCurrentUser',
            payload: currentUser,
          });
        } else {
          yield put(routerRedux.push('/user/login'));
          yield window.location.reload();
        }
      }

    },
  },

  reducers: {
    changeStatus(state, action) {
      return {
        ...state,
        status: action.payload.status,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
