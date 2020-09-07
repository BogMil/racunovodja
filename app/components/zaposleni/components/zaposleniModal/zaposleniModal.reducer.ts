import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE,
  OpenPayload,
  SET_ERRORS,
  SetErrorsPayload
} from './zaposleniModal.actions';
import { Opstina, ZaposleniCDTO } from '../../zaposleni.types';

const initialState: ZaposleniModalStore = {
  show: false,
  opstine: [],
  title: '',
  zaposleni: {} as ZaposleniCDTO,
  mode: '',
  errors: {}
};

export type ZaposleniModalStore = {
  show: boolean;
  opstine: Opstina[];
  title: string;
  zaposleni: ZaposleniCDTO;
  mode: string;
  errors: any;
};

export default function employeeModal(
  state: ZaposleniModalStore = initialState,
  action: Action
): ZaposleniModalStore {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { opstine, zaposleni, title, mode } = action.payload as OpenPayload;
      return {
        ...state,
        show: true,
        zaposleni,
        opstine,
        title: title,
        mode: mode
      };

    case CLOSE:
      return initialState;

    case SET_ERRORS:
      let { errors } = action.payload as SetErrorsPayload;
      return {
        ...state,
        errors
      };

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newEmployeeState = { ...state.zaposleni };
      (newEmployeeState as any)[name] = value;
      return { ...state, zaposleni: newEmployeeState };

    default:
      return state;
  }
}
