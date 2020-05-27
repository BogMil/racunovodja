import { combineReducers } from 'redux';
import relations from './relations.reducer';
import relationModal from './components/relationModal/relationModal.reducer';
import { RelationsStore } from './relations.reducer';
import { RelationModalStore } from './components/relationModal/relationModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    relations,
    relationModal
  });
}

export type RelationCombinedReducer = {
  relations: RelationsStore;
  relationModal: RelationModalStore;
};
