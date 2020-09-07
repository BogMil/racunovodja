import { Action } from '../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  HANDLE_CHANGE
} from './addDefaultRelationModal.actions';
import { Zaposleni, DefaultRelation } from '../../zaposleni.types';
import { Relation } from '../../../sifarnici/relations/relations.types';

const initialState: AddDefaultRelationModalStore = {
  show: false,
  employee: {} as Zaposleni,
  availableRelations: [],
  selectedRelation: -1
};

export type AddDefaultRelationModalStore = {
  show: boolean;
  employee: Zaposleni;
  availableRelations: Relation[];
  selectedRelation: number;
};

export default function addDefaultRelationModal(
  state: AddDefaultRelationModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let employee = action.payload.employee;
      let availableRelations = action.payload.availableRelations;
      return {
        ...state,
        show: true,
        employee: employee,
        availableRelations: availableRelations
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        employee: {},
        availableRelations: [],
        selectedRelation: -1
      };

    case HANDLE_CHANGE:
      let { value } = action.payload;
      return { ...state, selectedRelation: value };

    default:
      return state;
  }
}
