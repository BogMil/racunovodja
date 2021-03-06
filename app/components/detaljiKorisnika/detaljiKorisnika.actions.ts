import { Dispatch } from 'redux';
import { handleResponse } from '../../utils/responseHandler';
import * as service from './detaljiKorisnika.service';
import { Action } from '../../reducers/types';
import { DetaljiKorisnika } from './detaljiKorisnika.types';

export const LOAD_USER_DETAILS = 'LOAD_USER_DETAILS';
export const NAMESPACE = 'OTHER_SETTINGS';

export function loadUserDetails() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadUserDetails(response.data));
    });
  };

  function _loadUserDetails(userDetails: DetaljiKorisnika[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_USER_DETAILS,
      payload: { userDetails }
    };
  }
}

export function reloadUserDetails() {
  return loadUserDetails();
}
