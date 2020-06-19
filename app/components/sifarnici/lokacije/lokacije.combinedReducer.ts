import { combineReducers } from 'redux';

import lokacije, { LokacijeStore } from './lokacije.reducer';
import lokacijaModal, {
  LokacijaModalStore
} from './components/lokacijaModal/lokacijaModal.reducer';

export default function createCombinedReducer() {
  return combineReducers({
    lokacije,
    lokacijaModal
  });
}

export type LokacijaCombinedReducer = {
  lokacije: LokacijeStore;
  lokacijaModal: LokacijaModalStore;
};
