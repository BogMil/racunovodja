import { Action } from '../../reducers/types';
import { setToken } from '../../utils/tokenService';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const UNSET_AUTHENTICATED = 'UNSET_AUTHENTICATED';
export const NAMESPACE = 'AUTH';
export const LOGOUT = 'LOGOUT';

export function setUser(user: any, jwt: string): Action {
  setToken(jwt);
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
