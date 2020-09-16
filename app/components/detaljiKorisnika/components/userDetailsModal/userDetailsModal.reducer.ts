import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE
} from './userDetailsModal.actions';
import {
  DetaljiKorisnika,
  getInitDetaljiKorisnika
} from '../../detaljiKorisnika.types';
import { Opstina } from '../../../zaposleni/zaposleni.types';

const initialState: UserDetailsModalStore = {
  show: false,
  municipalityOptions: [],
  userDetails: {} as DetaljiKorisnika
};

export type UserDetailsModalStore = {
  show: boolean;
  municipalityOptions: Opstina[];
  userDetails: DetaljiKorisnika;
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
        userDetails: getInitDetaljiKorisnika(),
        municipalityOptions: []
      };

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newUserDetailsState = { ...state.userDetails };
      (newUserDetailsState as any)[name] = value;
      return { ...state, userDetails: newUserDetailsState };

    default:
      return state;
  }
}
