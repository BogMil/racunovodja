import { Action } from '../../reducers/types';
import { NAMESPACE, LOAD_OTHER_SETTINGS } from './settings.actions';

const initialState: OtherSettingsStore = {
  otherSettings: []
};

export type OtherSettingsStore = {
  otherSettings: OtherSetting[];
};

export default function employeesReducer(
  state: OtherSettingsStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case LOAD_OTHER_SETTINGS:
      let { otherSettings } = action.payload;
      return {
        ...state,
        otherSettings
      };

    default:
      return state;
  }
}
