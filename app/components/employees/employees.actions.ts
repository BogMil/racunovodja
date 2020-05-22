import { Employee } from './types';
import * as service from './employeeService';
import { Dispatch } from 'redux';
import { Action } from '../../reducers/types';
import { handleResponse } from '../../utils/responseHandler';

export const LOAD_EMPLOYEES = 'LOAD_EMPLOYEES';
export const RELOAD_EMPLOYEE = 'RELOAD_EMPLOYEE';
export const REMOVE_RELATION_FROM_EMPLOYEE = 'REMOVE_RELATION_FROM_EMPLOYEE';
export const NAMESPACE = 'EMPLOYEES';

export function loadEmployees() {
  return async (dispatch: Dispatch) => {
    // let employees = service.get();
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadEmployees(response.data));
    });
  };

  function _loadEmployees(employees: Employee[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_EMPLOYEES,
      payload: { employees }
    };
  }
}

export function reloadEmployees() {
  return loadEmployees();
}

export function reloadEmployee(id: number) {
  return (dispatch: Dispatch) => {
    let employee = service.getEmployee(id);
    dispatch(_reloadEmployee(employee));
  };

  function _reloadEmployee(employee: Employee): Action {
    return {
      namespace: NAMESPACE,
      type: RELOAD_EMPLOYEE,
      payload: { employee }
    };
  }
}

export function removeRelationFromEmployee(
  employee: Employee,
  defaultRelationId: number
) {
  return (dispatch: Dispatch) => {
    service.removeDefaultRelation(defaultRelationId);
    dispatch<any>(reloadEmployee(employee.id));
  };
}
