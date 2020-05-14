import { Action } from '../../reducers/types';
import {
  NAMESPACE,
  LOAD_EMPLOYEES,
  RELOAD_EMPLOYEE
} from './employees.actions';
import { Employee } from './types';

const initialState: EmployeesStore = {
  employees: []
};

export type EmployeesStore = {
  employees: Employee[];
};

export default function employeesReducer(
  state: EmployeesStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  let employees = [];

  switch (action.type) {
    case LOAD_EMPLOYEES:
      employees = action.payload.employees;
      return {
        ...state,
        employees: employees
      };

    case RELOAD_EMPLOYEE:
      let newEmployee = action.payload.employee;
      employees = state.employees.map(employee => {
        if (employee.id == newEmployee.id) employee = newEmployee;
        return employee;
      });

      return {
        ...state,
        employees: employees
      };

    default:
      return state;
  }
}
