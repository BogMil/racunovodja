import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type authStateType = {
  counter: number;
};

export type GetState = () => authStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<authStateType, Action<string>>;
