import { Dispatch } from 'redux';
import * as service from './dobavljaci.service';
import { Action } from '../../reducers/types';
import { handleResponse } from '../../utils/responseHandler';

export const LOAD_DOBAVLJACI = 'LOAD_DOBAVLJACI';
export const NAMESPACE = 'DOBAVLJACI';

export function loadDobavljaci() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadDobavljaci(response.data));
    });
  };

  function _loadDobavljaci(dobavljaci: Location[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_DOBAVLJACI,
      payload: { dobavljaci: dobavljaci }
    };
  }
}

export function reloadDobavljaci() {
  return loadDobavljaci();
}
