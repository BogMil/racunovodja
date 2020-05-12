import { Action } from 'redux';
import { SET_AUTHENTICATED } from './auth.actions';

const initialState={
  isAuthenticated:true
}

export default function auth(state = initialState, action: Action<string>) {
  // let payload=(action as DefaultActionType).payload;
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, isAuthenticated:true };
    default:
      return state;
  }
}

