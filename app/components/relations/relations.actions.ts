import { Dispatch } from 'redux';
import { handleResponse } from '../../utils/responseHandler';
import * as service from './relations.service';
import { Relation } from './relations.types';
import { Action } from '../../reducers/types';

export const LOAD_RELATIONS = 'LOAD_RELATIONS';
export const NAMESPACE = 'RELATIONS';

export function loadRelations() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadRelations(response.data));
    });
  };

  function _loadRelations(relations: Relation[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_RELATIONS,
      payload: { relations }
    };
  }
}

export function reloadRelations() {
  return loadRelations();
}
