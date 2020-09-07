import { Zaposleni } from './zaposleni.types';
import * as service from './zaposleni.service';
import { Dispatch } from 'redux';
import { Action } from '../../reducers/types';
import { handleResponse } from '../../utils/responseHandler';

export const LOAD_EMPLOYEES = 'LOAD_EMPLOYEES';
export const RELOAD_EMPLOYEE = 'RELOAD_EMPLOYEE';
export const REMOVE_RELATION_FROM_EMPLOYEE = 'REMOVE_RELATION_FROM_EMPLOYEE';
export const NAMESPACE = 'EMPLOYEES';

export function ucitajZaposlene() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadEmployees(response.data));
    });
  };

  function _loadEmployees(employees: Zaposleni[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_EMPLOYEES,
      payload: { employees }
    };
  }
}

export function reloadEmployees() {
  return ucitajZaposlene();
}

export function removeRelationFromEmployee(
  employeeId: number,
  defaultRelationId: number
) {
  return (dispatch: Dispatch) => {
    service.removeDefaultRelation(employeeId, defaultRelationId);
    dispatch<any>(reloadEmployees());
  };
}
