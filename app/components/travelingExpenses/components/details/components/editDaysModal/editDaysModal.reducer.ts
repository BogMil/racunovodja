import { Action } from '../../../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN } from './editDaysModal.actions';
import { Zaposleni } from '../../../../../zaposleni/zaposleni.types';
import { RelationWithDays } from '../../../../travelingExpenses.types';

const initialState: EditDaysModalStore = {
  show: false,
  employee: {},
  relationWithDays: {}
};

export type EditDaysModalStore = {
  show: boolean;
  employee: Zaposleni;
  relationWithDays: RelationWithDays;
};

export default function employeeModal(
  state: EditDaysModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      let { employee, relationWithDays } = action.payload;
      return {
        ...state,
        show: true,
        employee,
        relationWithDays
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        employee: {},
        relationWithDays: {},
        days: 0
      };

    default:
      return state;
  }
}
