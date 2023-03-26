import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export namespace Model_index {
  export type state = {
    name: string;
  };
  export type dispatch = {
    temp: (payload: number) => void;
    save: (payload: string) => void;
  };
  export type action = {
    temp: { type: 'index/temp'; payload: number };
    save: { type: 'index/save'; payload: string };
  };
}

export interface IndexModelType {
  namespace: string;
  state: Model_index.state;
  effects: Record<string, Effect>;
  reducers: Record<string, ImmerReducer<Model_index.state>>;
  subscriptions: Record<string, Subscription>;
}

const IndexModel: IndexModelType = {
  namespace: 'index',

  state: {
    name: '11',
  },
  effects: {
    *temp({ payload }, { call, put }) {
      console.log(22, payload);
    },
  },
  reducers: {
    save(state, action) {
      state.name = action.payload;
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/') {
    //       dispatch({
    //         type: 'query',
    //       });
    //     }
    //   });
    // },
  },
};

export default IndexModel;
