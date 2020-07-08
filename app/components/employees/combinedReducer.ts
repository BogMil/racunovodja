import { combineReducers } from 'redux';
import addDefaultRelationModal, {
  AddDefaultRelationModalStore
} from './components/addDefaultRelationModal/addDefaultRelationModal.reducer';

import employees, { EmployeesStore } from './employees.reducer';
import employeeModal, {
  EmployeeModalStore
} from './components/employeeModal/employeeModal.reducer';
import uploadModal, {
  UploadFileModalStore
} from './components/uploadFileModal/uploadFileModal.reducer';
import DPLEmailSyncModal, {
  DPLEmailSyncModalStore
} from './components/DPLEmailSyncModal/DPLEmailSyncModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    addDefaultRelationModal,
    employees,
    employeeModal,
    uploadModal,
    DPLEmailSyncModal
  });
}

export type EmployeeCombinedReducer = {
  addDefaultRelationModal: AddDefaultRelationModalStore;
  employees: EmployeesStore;
  employeeModal: EmployeeModalStore;
  uploadModal: UploadFileModalStore;
  DPLEmailSyncModal: DPLEmailSyncModalStore;
};
