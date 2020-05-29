import { Action } from '../../../../reducers/types';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';

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

export function handleChange(name: string, value: any): Action {
  return {
    namespace: NAMESPACE,
    type: HANDLE_CHANGE,
    payload: { name, value }
  };
}
