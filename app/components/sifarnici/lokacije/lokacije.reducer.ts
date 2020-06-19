import { Action } from '../../../reducers/types';
import { NAMESPACE, LOAD_LOCATIONS } from './lokacije.actions';
import { Lokacija } from './lokacije.types';

const initialState: LokacijeStore = {
  lokacije: []
};

export type LokacijeStore = {
  lokacije: Lokacija[];
};

export default function employeesReducer(
  state: LokacijeStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case LOAD_LOCATIONS:
      let { lokacije } = action.payload;
      return {
        ...state,
        lokacije
      };

    default:
      return state;
  }
}
