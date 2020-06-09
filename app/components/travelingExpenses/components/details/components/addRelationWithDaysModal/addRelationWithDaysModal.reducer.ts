import { Action } from '../../../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  SET_SELECTED_RELATION_ID
} from './addRelationWithDaysModal.actions';
import { Employee } from '../../../../../employees/types';
import { Relation } from '../../../../../relations/relations.types';

const initialState: AddRelationWithDaysModalStore = {
  show: false,
  relations: [],
  travelingExpenseId: -1,
  selectedRelationId: -1
};

export type AddRelationWithDaysModalStore = {
  show: boolean;
  relations: Relation[];
  selectedRelationId: number;
  travelingExpenseId: number;
};

export default function employeeModal(
  state: AddRelationWithDaysModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { relations, travelingExpenseId } = action.payload;
      return {
        ...state,
        show: true,
        relations,
        travelingExpenseId
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        relations: [],
        selectedRelationId: -1,
        travelingExpenseId: -1
      };

    case SET_SELECTED_RELATION_ID:
      let { relationId } = action.payload;
      return { ...state, selectedRelationId: relationId };

    default:
      return state;
  }
}
