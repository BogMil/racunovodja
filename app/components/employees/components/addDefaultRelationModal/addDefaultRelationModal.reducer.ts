import { Action } from '../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN } from './addDefaultRelationModal.actions';
import { Employee, DefaultRelation } from '../../types';

const initialState: AddDefaultRelationModalStore = {
  show: false,
  employee: {} as Employee,
  availableRelations: []
};

export type AddDefaultRelationModalStore = {
  show: boolean;
  employee: Employee;
  availableRelations: DefaultRelation[];
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
      return { ...state, show: false, employee: {}, availableRelations: [] };

    default:
      return state;
  }
}
