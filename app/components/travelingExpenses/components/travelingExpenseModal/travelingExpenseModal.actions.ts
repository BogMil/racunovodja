import { Action } from '../../../../reducers/types';
import {
  TravelingExpenseCDTO,
  newTravelingExpenseCDTO
} from '../../travelingExpenses.types';
import { Dispatch } from 'redux';
import { CREATE_MODE } from '../../../../constants/modalModes';
import * as employeeService from '../../../zaposleni/zaposleni.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { Employee } from './travelingExpenseModal.types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';
export const CHECK_EMPLOYEE = 'CHECK_EMPLOYEE';
export const CHECK_ALL = 'CHECK_ALL';

export const NAMESPACE = 'TRAVELING_EXPENSE_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    handleResponse(await employeeService.getActiveOnes(), (res: any) => {
      let employees = res.data;
      employees.map((e: any) => {
        e.checked = true;
        return e as Employee;
      });
      dispatch(
        _open(
          res.data,
          newTravelingExpenseCDTO(),
          'Kreiranje novog obračuna putnih troskova',
          CREATE_MODE
        )
      );
    });
  };
}

function _open(
  employees: Employee[],
  travelingExpense: TravelingExpenseCDTO,
  title: string,
  mode: string
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { employees, travelingExpense, title, mode }
  };
}

export function checkEmployee(id: number): Action {
  return {
    namespace: NAMESPACE,
    type: CHECK_EMPLOYEE,
    payload: { id }
  };
}

export function checkAll(): Action {
  return {
    namespace: NAMESPACE,
    type: CHECK_ALL
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function updateTravelingExpenseState(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
