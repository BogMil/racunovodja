import { Action } from '../../../../../reducers/types';
import { NAMESPACE, CLOSE, OPEN, HANDLE_CHANGE } from './relationModal.actions';
import { RelationCDTO, newRelationCDTO } from '../../relations.types';
import { Lokacija } from '../../../lokacije/lokacije.types';

const initialState: RelationModalStore = {
  show: false,
  title: '',
  relation: {} as RelationCDTO,
  lokacije: [],
  mode: ''
};

export type RelationModalStore = {
  show: boolean;
  title: string;
  relation: RelationCDTO;
  lokacije: Lokacija[];
  mode: string;
};

export default function RelationModal(
  state: RelationModalStore = initialState,
  action: Action
) {
  if (action.namespace != NAMESPACE) return state;
  switch (action.type) {
    case OPEN:
      const { relation, title, mode, lokacije } = action.payload;
      console.log(lokacije);
      return {
        ...state,
        show: true,
        relation: relation,
        title: title,
        mode: mode,
        lokacije: lokacije
      };

    case CLOSE:
      return {
        ...state,
        show: false,
        relation: newRelationCDTO(),
        title: '',
        mode: '',
        lokacije: []
      };

    case HANDLE_CHANGE:
      const { name, value } = action.payload;
      let newRelationState = { ...state.relation };
      newRelationState[name] = value;
      return { ...state, relation: newRelationState };

    default:
      return state;
  }
}
