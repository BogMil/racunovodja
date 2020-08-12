import { NAMESPACE, LOAD_DOBAVLJACI } from './dobavljaci.actions';
import { Dobavljac } from './dobavljaci.types';
import { Action } from '../../reducers/types';

const initialState: DobavljaciStore = {
  dobavljaci: []
};

export type DobavljaciStore = {
  dobavljaci: Dobavljac[];
};

export default function employeesReducer(
  state: DobavljaciStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case LOAD_DOBAVLJACI:
      let { dobavljaci } = action.payload;
      return {
        ...state,
        dobavljaci
      };

    default:
      return state;
  }
}
