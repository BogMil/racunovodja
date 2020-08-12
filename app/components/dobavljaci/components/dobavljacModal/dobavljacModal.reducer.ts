import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE
} from './dobavljacModal.actions';
import { DobavljacCDTO, newDobavljacCDTO } from '../../dobavljaci.types';

const initialState = (): DobavljacModalStore => {
  return {
    show: false,
    title: '',
    dobavljac: newDobavljacCDTO(),
    mode: ''
  };
};

export type DobavljacModalStore = {
  show: boolean;
  title: string;
  dobavljac: DobavljacCDTO;
  mode: string;
};

export default function employeeModal(
  state: DobavljacModalStore = initialState(),
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { dobavljac, title, mode } = action.payload;
      return {
        ...state,
        show: true,
        dobavljac,
        title: title,
        mode: mode
      };

    case CLOSE:
      return initialState();

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newDobavljacState = { ...state.dobavljac };
      newDobavljacState[name] = value;
      return { ...state, dobavljac: newDobavljacState };

    default:
      return state;
  }
}
