import { Action } from '../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN } from './DPLEmailSyncModal.actions';
import { EmployeeToSyncEmail } from './DPLEmailSyncModal.types';

const initialState: DPLEmailSyncModalStore = {
  show: false,
  employeeToSyncEmail: []
};

export type DPLEmailSyncModalStore = {
  show: boolean;
  employeeToSyncEmail: EmployeeToSyncEmail[];
};

export default function reducer(
  state: DPLEmailSyncModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { employeeToSyncEmail } = action.payload;
      return {
        ...state,
        show: true,
        employeeToSyncEmail
      };

    case CLOSE:
      return initialState;

    default:
      return state;
  }
}
