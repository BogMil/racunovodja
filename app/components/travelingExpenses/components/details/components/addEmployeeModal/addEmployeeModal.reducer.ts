import { Action } from '../../../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  SET_SELECTED_EMPLOYEE_ID
} from './addEmployeeModal.actions';
import { Employee } from '../../../../../employees/types';

const initialState: AddEmployeeModalStore = {
  show: false,
  employees: [],
  selectedEmployeeId: -1,
  travelingExpenseId: -1
};

export type AddEmployeeModalStore = {
  show: boolean;
  employees: Employee[];
  selectedEmployeeId: number;
  travelingExpenseId: number;
};

export default function employeeModal(
  state: AddEmployeeModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { employees, travelingExpenseId } = action.payload;
      return {
        ...state,
        show: true,
        employees,
        travelingExpenseId
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        employees: [],
        selectedEmployeeId: null,
        travelingExpenseId: null
      };

    case SET_SELECTED_EMPLOYEE_ID:
      let { employeeId } = action.payload;
      return { ...state, selectedEmployeeId: employeeId };

    default:
      return state;
  }
}
