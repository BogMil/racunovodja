import { Dispatch, GetState } from './auth.store.types';
import { Action } from '../../reducers/types';
import * as Service from './auth.service';

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

export function login(email: string, password: string) {
  return (dispatch: Dispatch) => {
    Service.login(email, password);
    dispatch(_login(email, relations));
  };

  function _login(user: User): Action {
    return {
      namespace: NAMESPACE,
      type: OPEN,
      payload: { employee, availableRelations }
    };
  }
}
