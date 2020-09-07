import { Action } from '../../../../reducers/types';
import { Zaposleni, DefaultRelation } from '../../zaposleni.types';
import * as service from '../../zaposleni.service';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'ADD_DEFAULT_RELATION_MODAL';

export function open(employee: Zaposleni) {
  return async (dispatch: Dispatch) => {
    handleResponse(
      await service.getAvailableDefaultRelationsForEmployee(employee.id),
      (res: any) => {
        dispatch(_open(employee, res.data));
      }
    );
  };

  function _open(
    employee: Zaposleni,
    availableRelations: DefaultRelation[]
  ): Action {
    return {
      namespace: NAMESPACE,
      type: OPEN,
      payload: { employee, availableRelations }
    };
  }
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function handleChange(value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { value }
  };
}
