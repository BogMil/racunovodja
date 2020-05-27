import { Action } from '../../reducers/types';
import { NAMESPACE, LOAD_RELATIONS } from './relations.actions';
import { Relation } from './relations.types';

const initialState: RelationsStore = {
  relations: []
};

export type RelationsStore = {
  relations: Relation[];
};

export default function employeesReducer(
  state: RelationsStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;

  switch (action.type) {
    case LOAD_RELATIONS:
      let { relations } = action.payload;
      return {
        ...state,
        relations: relations
      };

    default:
      return state;
  }
}
