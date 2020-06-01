import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE
} from './uploadFileModal.actions';

const initialState: UploadFileModalStore = {
  show: false,
  fileName: ''
};

export type UploadFileModalStore = {
  show: boolean;
  fileName: string;
};

export default function employeeModal(
  state: UploadFileModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      return {
        ...state,
        show: true
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        fileName: ''
      };

    default:
      return state;
  }
}
