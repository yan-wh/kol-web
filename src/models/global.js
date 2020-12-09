import { routerRedux } from 'dva/router';
import { queryNotices } from '@/services/api';
import { menus } from '@/services/user';
import { reloadAuthorized } from '@/utils/Authorized';
import { DOMAIN } from '@/utils/config';

const setMenu = menues => {
  if (menues && menues.length === 0) {
    return [];
  }
  // console.log(menues);
  const menuList = [];
  for (let i = 0; i < menues.length; i++) {
    if (!(menues[i].name === 'Dashboard' || (menues[i].mpid && menues[i].mpid < 0))) {
      menuList[i] = {
        icon: menues[i].icon,
        name: menues[i].name,
        path: menues[i].path,
        routes: menues[i].children,
      };

      if (menuList[i].path.indexOf('/ncov') !== 0) {
        menuList[i].target = '_self';
        const children = menues[i].children;

        if (children) {
          for (let j = 0; j < children.length; j++) {
            // children[j].path = DOMAIN + children[j].path;
            children[j].target = '_self';
          }
        }
      }
    }
  }
  // console.log(menuList);
  return menuList;
};

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menuses: [],
  },

  effects: {
    *query(_, { call, put, select }) {
      // console.log(localStorage.getItem('token'));
      const menuses = yield select(state => state.global.menuses);

      if (menuses.length === 0) {
        if (localStorage.getItem('token')) {
          // const menues = yield call(menus);
          const menues = yield call(menus);
          if (menues && menues.data) {
            yield put({
              type: 'menuses',
              payload: menues.data || [],
            });
          } else {
            yield put(routerRedux.push('/user/login'));
            window.location.reload();
          }
        } else {
          yield put(routerRedux.push('/user/login'));
          window.location.reload();
        }
      }
    },
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *redirect({ payload }, { put }) {
      if (!localStorage.getItem('token')) {
        const urlParams = new URL(window.location.href);
        const pathname = payload.pathname;
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        // console.log(pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    menuses(state, { payload }) {
      // console.log(payload);
      return {
        ...state,
        menuses: setMenu(payload),
      };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeRegion(state, { payload }) {
      if (payload && payload.region) {
        localStorage.setItem('region', payload.region);
        window.location.reload();
      }

      return state;
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }

        if (pathname !== '/user/login') {
          dispatch({
            type: 'redirect',
            payload: {
              pathname: pathname,
            },
          });
        }
      });
    },
  },
};
