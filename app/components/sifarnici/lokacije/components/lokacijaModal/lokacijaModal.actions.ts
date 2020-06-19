import { Action } from '../../../../../reducers/types';
import { Dispatch } from 'redux';
import { CREATE_MODE, EDIT_MODE } from '../../../../../constants/modalModes';
import { newLokacijaCDTO, Lokacija } from '../../lokacije.types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'LOKACIJA_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    dispatch(_open(newLokacijaCDTO(), 'Kreiranje nove lokacije', CREATE_MODE));
  };
}

export function openEdit(lokacija: Lokacija) {
  return async (dispatch: Dispatch) => {
    dispatch(_open(lokacija, 'Ažuriranje lokacije', EDIT_MODE));
  };
}

function _open(lokacija: Lokacija, title: string, mode: string): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { lokacija, title, mode }
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
