import { Action } from '../../../../reducers/types';
import { NAMESPACE } from './addDefaultRelationModal.actions';
import { OPEN } from './addDefaultRelationModal.actions';

const initialState = {
  show: false
};

export default function addDefaultRelationModal(
  state = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE)
    if (action)
      switch (action.type) {
        case OPEN:
          return { ...state, show: true };

        case OPEN:
          return { ...state, show: false };

        default:
          return state;
      }
}
