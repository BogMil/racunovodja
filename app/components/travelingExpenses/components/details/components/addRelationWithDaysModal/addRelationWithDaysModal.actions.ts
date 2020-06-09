import { Action } from '../../../../../../reducers/types';
import { Dispatch } from 'redux';
import * as service from '../../../../travelingExpenses.service';
import { handleResponse } from '../../../../../../utils/responseHandler';
import { Relation } from '../../../../../relations/relations.types';
export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const SET_SELECTED_RELATION_ID = 'SET_SELECTED_RELATION_ID';

export const NAMESPACE = 'ADD_RELATION_WITH_DAYS_MODAL';

export function open(travelingExpenseId: number) {
  return async (dispatch: Dispatch) => {
    handleResponse(
      await service.getAvailableRelations(travelingExpenseId),
      (response: any) => {
     dispatch(_open(response.data, travelingExpenseId));
      }
    );
  };

  function _open(relations: Relation[], travelingExpenseId: number): Action {
    return {
      namespace: NAMESPACE,
      type: OPEN,
      payload: { relations, travelingExpenseId }
    };
  }
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function setSelectedRelationId(relationId: number): Action {
  return {
    namespace: NAMESPACE,
    type: SET_SELECTED_RELATION_ID,
    payload: { relationId }
  };
}
