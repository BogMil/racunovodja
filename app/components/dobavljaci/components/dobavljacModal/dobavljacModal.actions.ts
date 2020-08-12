import { Action } from '../../../../reducers/types';
import { DobavljacCDTO, newDobavljacCDTO } from '../../dobavljaci.types';
import { Dispatch } from 'redux';
import { CREATE_MODE, EDIT_MODE } from '../../../../constants/modalModes';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'DOBAVLJAC_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    dispatch(
      _open(newDobavljacCDTO(), 'Kreiranje novog dobavljača', CREATE_MODE)
    );
  };
}

export function openEdit(dobavljac: DobavljacCDTO) {
  return async (dispatch: Dispatch) => {
    dispatch(_open(dobavljac, 'Ažuriranje dobavljača', EDIT_MODE));
  };
}

function _open(dobavljac: DobavljacCDTO, title: string, mode: string): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { dobavljac, title, mode }
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function updateDobavljacState(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
