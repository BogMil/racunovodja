import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN_CREATE,
  UPDATE_EMPLOYEE
} from './employeeModal.actions';
import { Municipality, EmployeeCDTO, newEmployeeCDTO } from '../../types';

const initialState: EmployeeModalStore = {
  show: false,
  municipalityOptions: [],
  title: '',
  employee: {} as EmployeeCDTO
};

export type EmployeeModalStore = {
  show: boolean;
  municipalityOptions: Municipality[];
  title: string;
  employee: EmployeeCDTO;
};

export default function employeeModal(
  state: EmployeeModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN_CREATE:
      let { municipalityOptions, employee } = action.payload;
      return {
        ...state,
        show: true,
        employee: employee,
        municipalityOptions,
        title: 'Kreiranje novog zaposlenog'
      };

    case CLOSE:
      return { ...state, show: false, employee: newEmployeeCDTO() };

    case UPDATE_EMPLOYEE:
      let { name, value } = action.payload;
      let newEmployeeState = state.employee;
      newEmployeeState[name] = value;
      return { ...state, employee: newEmployeeState };

    default:
      return state;
  }
}
