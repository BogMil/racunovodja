import { Action } from '../../../../reducers/types';
import {
  Opstina,
  newZaposleniCDTO,
  ZaposleniCDTO
} from '../../zaposleni.types';
import * as service from '../../zaposleni.service';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';
import { CREATE_MODE, EDIT_MODE } from '../../../../constants/modalModes';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';
export const SET_ERRORS = 'SET_ERRORS';

export const NAMESPACE = 'EMPLOYEE_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.getMunicipalityOptions(), (res: any) => {
      dispatch(
        _open(
          newZaposleniCDTO(),
          res.data,
          'Kreiranje novog zaposlenog',
          CREATE_MODE
        )
      );
    });
  };
}

export function openEdit(zaposleni: ZaposleniCDTO) {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.getMunicipalityOptions(), (res: any) => {
      dispatch(_open(zaposleni, res.data, 'Ažuriranje zaposlenog', EDIT_MODE));
    });
  };
}

function _open(
  zaposleni: ZaposleniCDTO,
  opstine: Opstina[],
  title: string,
  mode: string
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { opstine, zaposleni, title, mode } as OpenPayload
  };
}

export function setErrors(errors: any) {
  return {
    namespace: NAMESPACE,
    type: SET_ERRORS,
    payload: { errors } as SetErrorsPayload
  };
}

export type OpenPayload = {
  opstine: Opstina[];
  zaposleni: ZaposleniCDTO;
  title: string;
  mode: string;
};

export type SetErrorsPayload = {
  errors: any;
};

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function updateZaposleniState(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
