export default {
  state: '',
  reducers: {
    TYPE(state, { payload }) {
      return state;
    },
  },
  effects: {
    *TYPEA({ payload }, { put }) {
      yield put({ type: 'TYPE', payload });
    },
  },
};
