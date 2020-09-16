// import { Action } from 'redux';
import {
  SET_AUTHENTICATED,
  NAMESPACE,
  UNSET_AUTHENTICATED
} from './auth.actions';
import { Action } from '../../reducers/types';
import { User } from './auth.store.types';

const getInitialState = (): AuthStore => {
  return {
    isAuthenticated: false,
    user: null
  };
};

export type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
};

export default function auth(state = getInitialState(), action: Action) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case UNSET_AUTHENTICATED:
      return getInitialState();
    default:
      return state;
  }
}
