import { combineReducers, Reducer } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import auth from '../components/auth/auth.reducer';
import employeesCombinedReducer, {
  EmployeeCombinedReducer
} from '../components/employees/combinedReducer';
import relationsCombineReducer, {
  RelationCombinedReducer
} from '../components/relations/combinedReducer';
import travelingExpensesCombineReducer, {
  TravelingExpenseCombinedReducer
} from '../components/travelingExpenses/travelingExpenses.combinedReducer';

import otherSettings, {
  OtherSettingsStore
} from '../../app/components/otherSettings/otherSettings.reducer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth,
    employeesCombined: employeesCombinedReducer(),
    relationsCombined: relationsCombineReducer(),
    travelingExpensesCombined: travelingExpensesCombineReducer(),
    otherSettings
  });
}

export type AppStore = {
  router: Reducer<RouterState<History.PoorMansUnknown>>;
  auth: any;
  employeesCombined: EmployeeCombinedReducer;
  relationsCombined: RelationCombinedReducer;
  travelingExpensesCombined: TravelingExpenseCombinedReducer;
  otherSettings: OtherSettingsStore;
};
