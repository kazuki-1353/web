import { Effect, ImmerReducer, Subscription } from 'umi';

export namespace Model_index {
  export type state = {};
  export type dispatch = {
    TEMP: (payload: number) => void;
  };
}

interface Type {
  namespace: string;
  state: Model_index.state;
  reducers: Record<string, ImmerReducer<Model_index.state>>;
  effects: Record<string, Effect>;
  subscriptions: Record<string, Subscription>;
}

const Model_index: Type = {
  namespace: 'index',

  state: {},
  reducers: {
    // TEMP(state, action) {
    //   state.STATE = action.payload;
    // },
  },
  effects: {
    // *TEMP(action, effects) {
    //   yield effects.put({
    //     type: '',
    //     payload: action.payload,
    //   });
    // },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/') {
    //       dispatch({
    //         type: 'TEMP',
    //       });
    //     }
    //   });
    // },
  },
};

export default Model_index;
