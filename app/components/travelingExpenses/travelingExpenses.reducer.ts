import { Action } from '../../reducers/types';
import {
  NAMESPACE,
  LOAD_TRAVELING_EXPENSES
} from './travelingExpenses.actions';
import { TravelingExpense } from './travelingExpenses.types';

const initialState: TravelingExpensesStore = {
  travelingExpenses: []
};

export type TravelingExpensesStore = {
  travelingExpenses: TravelingExpense[];
};

export default function employeesReducer(
  state: TravelingExpensesStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  let travelExpenses = [];

  switch (action.type) {
    case LOAD_TRAVELING_EXPENSES:
      travelExpenses = action.payload.travelingExpenses;
      return {
        ...state,
        travelingExpenses: travelExpenses
      };

    default:
      return state;
  }
}
