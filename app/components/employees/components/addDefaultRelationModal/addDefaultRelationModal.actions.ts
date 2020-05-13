import { Action } from '../../../../reducers/types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export const NAMESPACE = 'ADD_DEFAULT_RELATION_MODAL';

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
