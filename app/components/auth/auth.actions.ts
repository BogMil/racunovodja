import { Dispatch, GetState } from './auth.store.types';
import { Action } from '../../reducers/types';

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const NAMESPACE = 'AUTH';

export function setAuthenticated(): Action {
  return {
    namespace: NAMESPACE,
    type: SET_AUTHENTICATED
  };
}

export function increment(): Action {
  return {
    namespace: NAMESPACE,
    type: INCREMENT_COUNTER
  };
}

export function decrement(): Action {
  return {
    namespace: NAMESPACE,
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay = 1000) {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
