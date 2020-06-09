import { combineReducers } from 'redux';
import travelingExpenses, {
  TravelingExpensesStore
} from './travelingExpenses.reducer';
import travelingExpenseModal, {
  TravelingExpenseModalStore
} from './components/travelingExpenseModal/travelingExpenseModal.reducer';
import travelingExpenseDetails, {
  TravelingExpenseDetailsStore
} from './components/details/details.reducer';
import editDaysModal, {
  EditDaysModalStore
} from './components/details/components/editDaysModal/editDaysModal.reducer';
import addEmployeeModal, {
  AddEmployeeModalStore
} from './components/details/components/addEmployeeModal/addEmployeeModal.reducer';
import addRelationWithDays, {
  AddRelationWithDaysModalStore
} from './components/details/components/addRelationWithDaysModal/addRelationWithDaysModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    travelingExpenses,
    travelingExpenseModal,
    travelingExpenseDetails,
    editDaysModal,
    addEmployeeModal,
    addRelationWithDays
  });
}

export type TravelingExpenseCombinedReducer = {
  travelingExpenses: TravelingExpensesStore;
  travelingExpenseDetails: TravelingExpenseDetailsStore;
  travelingExpenseModal: TravelingExpenseModalStore;
  editDaysModal: EditDaysModalStore;
  addEmployeeModal: AddEmployeeModalStore;
  addRelationWithDays: AddRelationWithDaysModalStore;
};
