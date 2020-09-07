import { combineReducers } from 'redux';
import addDefaultRelationModal, {
  AddDefaultRelationModalStore
} from './components/addDefaultRelationModal/addDefaultRelationModal.reducer';

import employees, { EmployeesStore } from './zaposleni.reducer';
import zaposleniModal, {
  ZaposleniModalStore
} from './components/zaposleniModal/zaposleniModal.reducer';
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
    zaposleniModal,
    uploadModal,
    DPLEmailSyncModal
  });
}

export type ZaposleniPageReducer = {
  addDefaultRelationModal: AddDefaultRelationModalStore;
  employees: EmployeesStore;
  zaposleniModal: ZaposleniModalStore;
  uploadModal: UploadFileModalStore;
  DPLEmailSyncModal: DPLEmailSyncModalStore;
};
