import { combineReducers } from 'redux';
import userDetails, { UserDetailsStore } from './detaljiKorisnika.reducer';
import userDetailsModalStore, {
  UserDetailsModalStore
} from './components/userDetailsModal/userDetailsModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    userDetails,
    userDetailsModalStore
  });
}

export type UserDetailsCombinedReducer = {
  userDetails: UserDetailsStore;
  userDetailsModalStore: UserDetailsModalStore;
};
