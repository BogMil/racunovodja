import { Action } from '../../../../../reducers/types';
import { RelationCDTO, newRelationCDTO } from '../../relations.types';
import { Dispatch } from 'redux';
import { CREATE_MODE, EDIT_MODE } from '../../../../../constants/modalModes';
import { handleResponse } from '../../../../../utils/responseHandler';
import { get as getLokacije } from '../../../lokacije/lokacija.service';
import { Lokacija } from '../../../lokacije/lokacije.types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'RELATION_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    handleResponse(await getLokacije(), (res: any) => {
      dispatch(
        _open(
          newRelationCDTO(),
          res.data,
          'Kreiranje nove relacije',
          CREATE_MODE
        )
      );
    });
  };
}

export function openEdit(relation: RelationCDTO) {
  return async (dispatch: Dispatch) => {
    handleResponse(await getLokacije(), (res: any) => {
      dispatch(_open(relation, res.data, 'Ažuriranje relacije', EDIT_MODE));
    });
  };
}

function _open(
  relation: RelationCDTO,
  lokacije: Lokacija[],
  title: string,
  mode: string
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { relation, lokacije, title, mode }
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
