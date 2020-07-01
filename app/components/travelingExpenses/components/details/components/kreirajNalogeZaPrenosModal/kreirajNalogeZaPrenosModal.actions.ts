import { Action } from '../../../../../../reducers/types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'KREIRAJ_NALOGE_ZA_PRENOS_MODAL';

export function open(): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

export function handleChange(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
