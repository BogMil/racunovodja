import { combineReducers } from 'redux';
import addDefaultRelationModal, {
  AddDefaultRelationModalStore
} from './components/addDefaultRelationModal/addDefaultRelationModal.reducer';

import employees, { EmployeesStore } from './employees.reducer';
import employeeModal, {
  EmployeeModalStore
} from './components/employeeModal/employeeModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    addDefaultRelationModal,
    employees,
    employeeModal
  });
}

export type EmployeeCombinedReducer = {
  addDefaultRelationModal: AddDefaultRelationModalStore;
  employees: EmployeesStore;
  employeeModal: EmployeeModalStore;
};
