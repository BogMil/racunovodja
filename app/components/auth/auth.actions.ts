import { Dispatch, GetState } from './auth.store.types';
import { Action } from '../../reducers/types';
import * as Service from './auth.service';
import { handleResponse } from '../../utils/responseHandler';
import { useHistory } from 'react-router-dom';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const NAMESPACE = 'AUTH';
export const LOGOUT = 'LOGOUT';

export function setAuthenticated(): Action {
  return {
    namespace: NAMESPACE,
    type: SET_AUTHENTICATED
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

export function logout() {
  return async (dispatch: Dispatch) => {
    var res = await Service.logout();
    handleResponse(res, () => {
      let history = useHistory();

      history.push({
        pathname: 'SUCCESS_REGISTRATION',
        state: { trialPeriod: 'asd' }
      });
    });
  };

  function _logout(): Action {
    return {
      namespace: NAMESPACE,
      type: LOGOUT
    };
  }
}
