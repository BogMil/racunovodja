import { Action } from '../../../../reducers/types';
import { NAMESPACE, LOAD_TRAVELING_EXPENSE_DETAILS } from './details.actions';
import { TravelingExpenseWithDetails } from '../../travelingExpenses.types';

export const initialState: TravelingExpenseDetailsStore = {
  creation_date: '',
  employees_with_relation: [],
  id: 0,
  month: 0,
  user_id: 0,
  year: 0,
  maxNonTaxedValue: 0,
  preracun_na_bruto: 0,
  stopa: 0,
  status: -1
};

export interface TravelingExpenseDetailsStore
  extends TravelingExpenseWithDetails {}

export default function employeesReducer(
  state: TravelingExpenseDetailsStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case LOAD_TRAVELING_EXPENSE_DETAILS:
      let travelingExpense = action.payload.travelingExpense;
      return {
        ...state,
        ...travelingExpense
      };

    default:
      return state;
  }
}
