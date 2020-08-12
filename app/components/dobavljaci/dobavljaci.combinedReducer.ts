import { combineReducers } from 'redux';

import dobavljaci, { DobavljaciStore } from './dobavljaci.reducer';
import dobavljacModal, {
  DobavljacModalStore
} from './components/dobavljacModal/dobavljacModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    dobavljaci: dobavljaci,
    dobavljacModal: dobavljacModal
  });
}

export type DobavljacCombinedReducer = {
  dobavljaci: DobavljaciStore;
  dobavljacModal: DobavljacModalStore;
};
