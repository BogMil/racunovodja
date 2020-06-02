import { Action } from '../../../../reducers/types';
import { Employee } from './travelingExpenseModal.types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE
} from './travelingExpenseModal.actions';
import {
  TravelingExpenseCDTO,
  newTravelingExpenseCDTO
} from '../../travelingExpenses.types';

const initialState: TravelingExpenseModalStore = {
  show: false,
  title: '',
  travelingExpense: {} as TravelingExpenseCDTO,
  mode: '',
  employees: []
};

export type TravelingExpenseModalStore = {
  show: boolean;
  title: string;
  travelingExpense: TravelingExpenseCDTO;
  mode: string;
  employees: Employee[];
};

export default function employeeModal(
  state: TravelingExpenseModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { travelingExpense, title, mode } = action.payload;
      return {
        ...state,
        show: true,
        travelingExpense: travelingExpense,
        title: title,
        mode: mode
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        travelingExpense: newTravelingExpenseCDTO(),
        title: '',
        mode: ''
      };

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newState = { ...state.travelingExpense };
      newState[name] = value;
      return { ...state, travelingExpenses: newState };

    default:
      return state;
  }
}
