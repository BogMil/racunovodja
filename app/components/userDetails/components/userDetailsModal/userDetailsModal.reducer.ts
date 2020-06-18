import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE
} from './userDetailsModal.actions';
import { Municipality, EmployeeCDTO, newEmployeeCDTO } from '../../types';
import { UserDetails, getInitialUserDetails } from '../../userDetails.types';

const initialState: UserDetailsModalStore = {
  show: false,
  municipalityOptions: [],
  userDetails: {} as UserDetails
};

export type UserDetailsModalStore = {
  show: boolean;
  municipalityOptions: Municipality[];
  userDetails: UserDetails;
};

export default function userDetailsModal(
  state: UserDetailsModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { municipalityOptions, userDetails } = action.payload;
      return {
        ...state,
        show: true,
        municipalityOptions,
        userDetails
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        userDetails: getInitialUserDetails(),
        municipalityOptions: []
      };

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newUserDetailsState = { ...state.userDetails };
      newUserDetailsState[name] = value;
      return { ...state, userDetails: newUserDetailsState };

    default:
      return state;
  }
}
