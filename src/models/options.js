import {message} from 'antd';
import {options} from '@/services/option';
import { errorReport } from '@/constants/error';

export default {
  namespace: 'options',

  state: {
    list: {},
    status: true,
  },

  effects: {
    *fetch({payload}, {call, put, select}) {
      const status = yield select(state => state.options.status);
      if (status) {
        yield put({
          type: 'changeStatus',
          payload: {
            status: !status,
          },
        });
        const response = yield call(options, payload);

        if (response && !response.error) {
          yield put({
            type: 'queryList',
            payload: {
              ...response,
            },
          });
        } else {
          message.error('获取下拉选项列表失败', 5);
          errorReport(response.code, response.error);
        }
      }
    }
  },

  reducers: {
    changeStatus(state, {payload}) {
      return {
        ...state,
        status: payload.status,
      };
    },
    queryList(state, action) {
      // console.log(action.payload.data)
      return {
        ...state,
        list: action.payload.data,
      };
    }
  },
};
