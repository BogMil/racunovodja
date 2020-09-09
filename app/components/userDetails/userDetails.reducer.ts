import { Action } from '../../reducers/types';
import { NAMESPACE, LOAD_USER_DETAILS } from './userDetails.actions';
import { DetaljiKorisnika } from './userDetails.types';

const initialState: UserDetailsStore = {
  userDetails: {} as DetaljiKorisnika
};

export type UserDetailsStore = {
  userDetails: DetaljiKorisnika;
};

export default function userDetails(
  state: UserDetailsStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case LOAD_USER_DETAILS:
      let { userDetails } = action.payload;
      return {
        ...state,
        userDetails
      };

    default:
      return state;
  }
}
