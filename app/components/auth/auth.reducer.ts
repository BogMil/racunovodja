// import { Action } from 'redux';
import { SET_AUTHENTICATED, NAMESPACE } from './auth.actions';
import { Action } from '../../reducers/types';

const initialState = {
  isAuthenticated: false
};

export default function auth(state = initialState, action: Action) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, isAuthenticated: true };
    default:
      return state;
  }
}
