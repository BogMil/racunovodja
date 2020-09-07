import { RelationWithDays } from '../../../../travelingExpenses.types';
import { Zaposleni } from '../../../../../zaposleni/zaposleni.types';
import { Action } from '../../../../../../reducers/types';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export const NAMESPACE = 'EDIT_DAYS_MODAL';

export function open(
  relationWithDays: RelationWithDays,
  employee: Zaposleni
): Action {
  return {
    namespace: NAMESPACE,
    type: OPEN,
    payload: { employee, relationWithDays }
  };
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}
