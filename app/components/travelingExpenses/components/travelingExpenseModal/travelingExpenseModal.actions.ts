import { Action } from '../../../../reducers/types';
import {
  TravelingExpenseCDTO,
  newTravelingExpenseCDTO,
  TravelingExpense
} from '../../travelingExpenses.types';
import { Dispatch } from 'redux';
import { CREATE_MODE, EDIT_MODE } from '../../../../constants/modalModes';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'TRAVELING_EXPENSE_MODAL';

export function openCreate() {
  return async (dispatch: Dispatch) => {
    dispatch(
      _open(
        newTravelingExpenseCDTO(),
        'Kreiranje novog obračuna putnih troskova',
        CREATE_MODE
      )
    );
  };
}

export function openEdit(travelingExpenses: TravelingExpense) {
  return async (dispatch: Dispatch) => {
    dispatch(
      _open(travelingExpenses, 'Ažuriranje obračuna putnih troskova', EDIT_MODE)
    );
  };
}

function _open(
  travelingExpense: TravelingExpenseCDTO,
  title: string,
  mode: string
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { travelingExpense, title, mode }
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function updateTravelingExpenseState(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
