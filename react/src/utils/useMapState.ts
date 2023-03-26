/* 

import useMapState from '../../utils/useMapState';

let [store, setStore] = useMapState('');
setStore({
  payload
});

let [config, setConfig] = useMapState<Config>((state) => state.config);
setConfig({
  type: 'config',
  payload: (state) => {
    return {
      ...state,
    };
  }
});

*/

import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

type Action<T> = {
  payload: T | ((store: T) => T);
  type?: string;
};
type SetState<T> = [T, (action: Action<T>) => Action<T>];

function useMapState<T>(type: string): SetState<T>;
function useMapState<T>(type: (state) => T): SetState<T>;
function useMapState<T>(type) {
  let dispatch = useDispatch();

  let store: T = useSelector(
    typeof type === 'function' ? type : (state) => state[type],
  );

  let setStore = useCallback(
    (action: Action<T>): void => {
      if (typeof type === 'function' && !action.type) {
        throw new Error('action 缺失 type');
      }

      let payload =
        typeof action.payload === 'function'
          ? action.payload(store)
          : action.payload;

      return dispatch({
        type: action.type || type,
        payload,
      });
    },
    [, type, dispatch, store],
  );

  let mapState = useMemo(() => [store, setStore], [store, setStore]);
  return mapState;
}

export default useMapState;
