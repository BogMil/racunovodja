import { Action } from '../../../../reducers/types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'UPLOAD_FILE_MODAL';

export function open(): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: {}
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}
