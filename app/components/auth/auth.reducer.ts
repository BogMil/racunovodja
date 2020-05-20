// import { Action } from 'redux';
import {
  SET_AUTHENTICATED,
  NAMESPACE,
  UNSET_AUTHENTICATED
} from './auth.actions';
import { Action } from '../../reducers/types';

const initialState = {
  isAuthenticated: false,
  user: null
};

export default function auth(state = initialState, action: Action) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case UNSET_AUTHENTICATED:
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
}
