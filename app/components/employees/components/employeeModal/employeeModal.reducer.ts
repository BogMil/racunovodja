import { Action } from '../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN, HANDLE_CHANGE } from './employeeModal.actions';
import { Municipality, EmployeeCDTO, newEmployeeCDTO } from '../../types';

const initialState: EmployeeModalStore = {
  show: false,
  municipalityOptions: [],
  title: '',
  employee: {} as EmployeeCDTO,
  mode: ''
};

export type EmployeeModalStore = {
  show: boolean;
  municipalityOptions: Municipality[];
  title: string;
  employee: EmployeeCDTO;
  mode: string;
};

export default function employeeModal(
  state: EmployeeModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { municipalityOptions, employee, title, mode } = action.payload;
      return {
        ...state,
        show: true,
        employee: employee,
        municipalityOptions,
        title: title,
        mode: mode
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        employee: newEmployeeCDTO(),
        title: '',
        mode: ''
      };

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newEmployeeState = { ...state.employee };
      newEmployeeState[name] = value;
      return { ...state, employee: newEmployeeState };

    default:
      return state;
  }
}
