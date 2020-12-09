import { message } from 'antd'
import { QUERY, GET, POST, DEL, PUT } from '@/services/template'
// import { errorReport } from '@/constants/error';

export default {
  namespace: 'template',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: undefined,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(QUERY, payload)
      if (response && !response.error) {
        yield put({
          type: 'saveList',
          payload: {
            ...payload,
            ...response,
          },
        })
        callback && callback()
      }
    },
    *detail({ payload, callback }, { call, put }) {
      const response = yield call(GET, payload)
      if (response && !response.error) {
        yield put({
          type: 'saveDetail',
          payload: response,
        })
        callback && callback()
      }
    },
    *create({ payload, callback }, { call, put }) {
      const response = yield call(POST, payload)
      if (response && !response.error) {
        message.success('添加成功')
        callback && callback()
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(DEL, payload)
      if (response && !response.error) {
        message.success('删除成功')
        callback && callback()
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(PUT, payload)
      if (response && !response.error) {
        message.success('修改成功')
        callback && callback()
      }
    }
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.data,
          pagination: {
            current: payload.page || 1,
            pageSize: payload.page_size || 20,
            total: payload.total || 0,
          },
        },
      }
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload.data,
      }
    },
    clearDetail(state) {
      return {
        ...state,
        detail: undefined,
      }
    }
  },
}