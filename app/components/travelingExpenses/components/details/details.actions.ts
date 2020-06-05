import * as service from '../../travelingExpenses.service';
import { Dispatch } from 'redux';
import { Action } from '../../../../reducers/types';
import { handleResponse } from '../../../../utils/responseHandler';

export const LOAD_TRAVELING_EXPENSE_DETAILS = 'LOAD_TRAVELING_EXPENSE_DETAILS';
export const RELOAD_TRAVELING_EXPENSE_DETAILS =
  'RELOAD_TRAVELING_EXPENSE_DETAILS';
export const NAMESPACE = 'TRAVELING_EXPENSE_DETAILS';

export function loadTravelingExpenseDetails(id: number) {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.details(id), (response: any) => {
      dispatch(_loadTravelingExpenseDetails(response.data));
    });
  };

  function _loadTravelingExpenseDetails(travelingExpense: any): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_TRAVELING_EXPENSE_DETAILS,
      payload: { travelingExpense }
    };
  }
}

export function reloadTravelingExpenseDetails(id: number) {
  return loadTravelingExpenseDetails(id);
}
