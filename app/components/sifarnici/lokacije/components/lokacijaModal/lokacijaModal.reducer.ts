import { Action } from '../../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN, HANDLE_CHANGE } from './lokacijaModal.actions';
import { Lokacija, newLokacijaCDTO } from '../../lokacije.types';

const initialState: LokacijaModalStore = {
  show: false,
  title: '',
  lokacija: {} as Lokacija,
  mode: ''
};

export type LokacijaModalStore = {
  show: boolean;
  title: string;
  lokacija: Lokacija;
  mode: string;
};

export default function RelationModal(
  state: LokacijaModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      const { lokacija, title, mode } = action.payload;
      return {
        ...state,
        show: true,
        lokacija: lokacija,
        title: title,
        mode: mode
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        lokacija: newLokacijaCDTO(),
        title: '',
        mode: ''
      };

    case HANDLE_CHANGE:
      const { name, value } = action.payload;
      let newLokacijaState = { ...state.lokacija };
      newLokacijaState[name] = value;
      return { ...state, lokacija: newLokacijaState };

    default:
      return state;
  }
}
