import { Dispatch } from 'redux';
import { handleResponse } from '../../utils/responseHandler';
import * as service from './otherSettings.service';
import { Action } from '../../reducers/types';

export const LOAD_OTHER_SETTINGS = 'LOAD_OTHER_SETTINGS';
export const NAMESPACE = 'OTHER_SETTINGS';

export function loadOtherSettings() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), (response: any) => {
      dispatch(_loadOtherSettings(response.data));
    });
  };

  function _loadOtherSettings(otherSettings: OtherSetting[]): Action {
    return {
      namespace: NAMESPACE,
      type: LOAD_OTHER_SETTINGS,
      payload: { otherSettings }
    };
  }
}

export function reloadRelations() {
  return loadOtherSettings();
}
