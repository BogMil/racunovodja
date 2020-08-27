import { Action } from '../../reducers/types';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const UNSET_AUTHENTICATED = 'UNSET_AUTHENTICATED';
export const NAMESPACE = 'AUTH';
export const LOGOUT = 'LOGOUT';

export function setUser(user: any): Action {
  return {
    namespace: NAMESPACE,
    type: SET_AUTHENTICATED,
    payload: { user }
  };
}

export function unsetUser(): Action {
  return {
    namespace: NAMESPACE,
    type: UNSET_AUTHENTICATED
  };
}
