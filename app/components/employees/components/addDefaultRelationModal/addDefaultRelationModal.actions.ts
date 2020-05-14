import { Action } from '../../../../reducers/types';
import { Employee, DefaultRelation } from '../../types';
import * as service from '../../employeeService';
import { Dispatch } from 'redux';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export const NAMESPACE = 'ADD_DEFAULT_RELATION_MODAL';

export function open(employee: Employee) {
  return (dispatch: Dispatch) => {
    let relations = service.getAvailableDefaultRelationsForEmployee(
      employee.id
    );
    dispatch(_open(employee, relations));
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
