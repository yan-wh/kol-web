import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { accountLogin } from '@/services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // });
      // // Login successfully
      // // console.log();
      // if (response && response.success === true) {
      //   reloadAuthorized();
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params;
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.startsWith('/#')) {
      //         redirect = redirect.substr(2);
      //       }
      //     } else {
      //       window.location.href = redirect;
      //       return;
      //     }
      //   }
      //   yield put(routerRedux.replace(redirect || '/'));
      // }
      const response = yield call(accountLogin, payload);
      // console.log('res', response);

      // console.log('response', response)
      let loginStatus = { currentAuthority: 'guest', status: 'error', type: 'account' };
      if (response && response.success === true) {
        localStorage.setItem('token', response.token)
        loginStatus = { currentAuthority: 'admin', status: 'ok', type: 'account' };
      }

      yield put({
        type: 'changeLoginStatus',
        payload: loginStatus,
      });
      // Login successfully
      if (response && response.success === true) {
        reloadAuthorized();
        yield put(routerRedux.push('/boilerplate'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, select }) {
      try {
        localStorage.removeItem('token')
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        // yield put(routerRedux.replace({
        //   pathname: '/user/login',
        // }));
        // window.location.reload('/user/login');
        // console.log(window.location);
        window.location.replace(`/user/login${window.location.search}`);
      }
      // console.log(window.location.href);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
