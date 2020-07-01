import { Action } from '../../../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN } from './kreirajNalogeZaPrenosModal.actions';
import { HANDLE_CHANGE } from './kreirajNalogeZaPrenosModal.actions';

const initialState: KreirajNalogeZaPrenosModalStore = {
  show: false,
  podaciONalogu: {
    datumIzvrsenja: new Date(),
    izvorPrihoda: '01',
    datumPrijema: new Date(),
    pozivNaBrojOdobrenje: ''
  } as PodaciONalogu
};

export type KreirajNalogeZaPrenosModalStore = {
  show: boolean;
  podaciONalogu: PodaciONalogu;
};

export type PodaciONalogu = {
  datumPrijema: Date;
  datumIzvrsenja: Date;
  izvorPrihoda: string;
  pozivNaBrojOdobrenje: string;
};

export default function reducer(
  state: KreirajNalogeZaPrenosModalStore = initialState,
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
      return initialState;

    case HANDLE_CHANGE:
      let { name, value } = action.payload;
      let newState = { ...state.podaciONalogu };
      newState[name] = value;
      return { ...state, podaciONalogu: newState };

    default:
      return state;
  }
}
