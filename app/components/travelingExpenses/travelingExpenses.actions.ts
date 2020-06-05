import * as service from './travelingExpenses.service';
import { Dispatch } from 'redux';
import { Action } from '../../reducers/types';
import { handleResponse } from '../../utils/responseHandler';
import { TravelingExpense } from './travelingExpenses.types';

export const LOAD_TRAVELING_EXPENSES = 'LOAD_TRAVELING_EXPENSES';
export const RELOAD_TRAVELING_EXPENSES = 'RELOAD_TRAVELING_EXPENSES';
export const NAMESPACE = 'TRAVELING_EXPENSES';

export function loadTravelingExpenses() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadTravelingExpenses(response.data));
    });
  };

  function _loadTravelingExpenses(
    travelingExpenses: TravelingExpense[]
  ): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_TRAVELING_EXPENSES,
      payload: { travelingExpenses }
    };
  }
}

export function reloadTravelingExpenses() {
  return loadTravelingExpenses();
}
