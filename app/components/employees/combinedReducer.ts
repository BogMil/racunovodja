import { combineReducers } from 'redux';
import addDefaultRelationModal from './components/addDefaultRelationModal/addDefaultRelationModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    addDefaultRelationModal
  });
}
