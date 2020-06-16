import { Action } from '../../../../../../reducers/types';
import {
  NAMESPACE,
  CLOSE,
  OPEN,
  SET_SELECTED_RELATION_ID
} from './addRelationWithDaysModal.actions';
import { Relation } from '../../../../../relations/relations.types';

const initialState: AddRelationWithDaysModalStore = {
  show: false,
  relations: [],
  travelingExpenseEmployeeId: -1,
  selectedRelationId: -1
};

export type AddRelationWithDaysModalStore = {
  show: boolean;
  relations: Relation[];
  selectedRelationId: number;
  travelingExpenseEmployeeId: number;
};

export default function employeeModal(
  state: AddRelationWithDaysModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { relations, travelingExpenseEmployeeId } = action.payload;
      return {
        ...state,
        show: true,
        relations,
        travelingExpenseEmployeeId
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        relations: [],
        selectedRelationId: -1,
        travelingExpenseEmployeeId: -1
      };

    case SET_SELECTED_RELATION_ID:
      let { relationId } = action.payload;
      return { ...state, selectedRelationId: relationId };

    default:
      return state;
  }
}
