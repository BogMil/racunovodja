import { Action } from '../../../../reducers/types';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';
import { DetaljiKorisnika } from '../../userDetails.types';
import { getMunicipalityOptions } from '../../../zaposleni/zaposleni.service';
import { Opstina } from '../../../zaposleni/zaposleni.types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'USER_DETAILS_MODAL';

export function open(userDetails: DetaljiKorisnika) {
  return async (dispatch: Dispatch) => {
    handleResponse(await getMunicipalityOptions(), (res: any) => {
      dispatch(_open(userDetails, res.data));
    });
  };
}

function _open(
  userDetails: DetaljiKorisnika,
  municipalityOptions: Opstina[]
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { municipalityOptions, userDetails }
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function handleChange(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
