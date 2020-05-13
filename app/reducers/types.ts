import { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type racunovodjaStoreType = {
  counter: number;
};

export type GetState = () => racunovodjaStoreType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<racunovodjaStoreType, Action>;

export interface Action {
  type: string;
  namespace: string;
  payload?: any;
}
