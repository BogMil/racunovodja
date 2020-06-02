import { combineReducers } from 'redux';
import travelingExpenses, {
  TravelingExpensesStore
} from './travelingExpenses.reducer';
import travelingExpenseModal, {
  TravelingExpenseModalStore
} from './components/travelingExpenseModal/travelingExpenseModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    travelingExpenses,
    travelingExpenseModal
  });
}

export type TravelingExpenseCombinedReducer = {
  travelingExpenses: TravelingExpensesStore;
  travelingExpenseModal: TravelingExpenseModalStore;
};
