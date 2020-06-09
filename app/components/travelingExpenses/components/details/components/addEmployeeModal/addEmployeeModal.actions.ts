import { Action } from '../../../../../../reducers/types';
import { Dispatch } from 'redux';
import * as service from '../../../../travelingExpenses.service';
import { Employee } from '../../../../../employees/types';
import { handleResponse } from '../../../../../../utils/responseHandler';
export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const SET_SELECTED_EMPLOYEE_ID = 'SET_SELECTED_EMPLOYEE_ID';
export const NAMESPACE = 'ADD_EMPLOYEE_TO_TRAVELING_EXPENSE_MODAL';

export function open(travelingExpenseId: number) {
  return async (dispatch: Dispatch) => {
    handleResponse(
      await service.getAvailableEmployees(travelingExpenseId),
      (response: any) => {
        dispatch(_open(response.data, travelingExpenseId));
      }
    );
  };

  function _open(employees: Employee[], travelingExpenseId: number): Action {
    return {
      namespace: NAMESPACE,
      type: OPEN,
      payload: { employees, travelingExpenseId }
    };
  }
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function setSelectedEmployeeId(employeeId: number): Action {
  return {
    namespace: NAMESPACE,
    type: SET_SELECTED_EMPLOYEE_ID,
    payload: { employeeId }
  };
}
