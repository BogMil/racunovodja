import { Dispatch } from 'redux';
import { handleResponse } from '../../../utils/responseHandler';
import * as service from './lokacija.service';
import { Action } from '../../../reducers/types';

export const LOAD_LOCATIONS = 'LOAD_LOCATIONS';
export const NAMESPACE = 'LOKACIJE';

export function loadLocations() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadLocations(response.data));
    });
  };

  function _loadLocations(lokacije: Location[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_LOCATIONS,
      payload: { lokacije }
    };
  }
}

export function reloadLocations() {
  return loadLocations();
}
