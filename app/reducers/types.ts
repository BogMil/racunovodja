import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type racunovodjaStateType = {
  counter: number;
};

export type GetState = () => racunovodjaStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<racunovodjaStateType, Action<string>>;
