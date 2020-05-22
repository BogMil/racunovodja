import { Action } from '../../../../reducers/types';
import { Municipality, newEmployeeCDTO, EmployeeCDTO } from '../../types';
import * as service from '../../employeeService';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';

export const OPEN_CREATE = 'OPEN_CREATE';
export const CLOSE = 'CLOSE';

export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';

export const NAMESPACE = 'EMPLOYEE_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.getMunicipalityOptions(), (res: any) => {
      dispatch(_openCreate(newEmployeeCDTO(), res.data));
    });
  };

  function _openCreate(
    employee: EmployeeCDTO,
    municipalityOptions: Municipality
  ): Action {
    return {
      namespace: NAMESPACE,
      type: OPEN_CREATE,
      payload: { municipalityOptions, employee }
    };
  }
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function updateEmployeeState(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: UPDATE_EMPLOYEE,
    payload: { name, value }
  };
}
