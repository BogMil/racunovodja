import { combineReducers } from 'redux';
import addDefaultRelationModal, {
  AddDefaultRelationModalStore
} from './components/addDefaultRelationModal/addDefaultRelationModal.reducer';
import employees, { EmployeesStore } from './employees.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    addDefaultRelationModal,
    employees
  });
}

export type EmployeeCombinedReducer = {
  addDefaultRelationModal: AddDefaultRelationModalStore;
  employees: EmployeesStore;
};
