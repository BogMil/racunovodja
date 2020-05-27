import { Action } from '../../../../reducers/types';
import { Municipality, newEmployeeCDTO, EmployeeCDTO } from '../../types';
import * as service from '../../employeeService';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'EMPLOYEE_MODAL';

export const EDIT_MODE = 'EDIT_MODE';
export const CREATE_MODE = 'CREATE_MODE';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.getMunicipalityOptions(), (res: any) => {
      dispatch(
        _open(
          newEmployeeCDTO(),
          res.data,
          'Kreiranje novog zaposlenog',
          CREATE_MODE
        )
      );
    });
  };
}

export function openEdit(employee: EmployeeCDTO) {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.getMunicipalityOptions(), (res: any) => {
      dispatch(_open(employee, res.data, 'Ažuriranje zaposlenog', EDIT_MODE));
    });
  };
}

function _open(
  employee: EmployeeCDTO,
  municipalityOptions: Municipality,
  title: string,
  mode: string
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { municipalityOptions, employee, title, mode }
  };
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
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
