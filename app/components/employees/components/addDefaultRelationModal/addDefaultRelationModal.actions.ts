import { Action } from '../../../../reducers/types';
import { Employee, DefaultRelation } from '../../types';
import * as service from '../../employee.service';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'ADD_DEFAULT_RELATION_MODAL';

export function open(employee: Employee) {
  return async (dispatch: Dispatch) => {
    handleResponse(
      await service.getAvailableDefaultRelationsForEmployee(employee.id),
      (res: any) => {
        dispatch(_open(employee, res.data));
      }
    );
  };

  function _open(
    employee: Employee,
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
