import { combineReducers, Reducer } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import auth from '../components/auth/auth.reducer';
import employeesCombinedReducer, {
  EmployeeCombinedReducer
} from '../components/employees/combinedReducer';
import relationsCombineReducer, {
  RelationCombinedReducer
} from '../components/sifarnici/relations/combinedReducer';
import travelingExpensesCombineReducer, {
  TravelingExpenseCombinedReducer
} from '../components/travelingExpenses/travelingExpenses.combinedReducer';

import userDetailsCombined, {
  UserDetailsCombinedReducer
} from '../components/userDetails/userDetails.combinedReducer';
import lokacijeCombined, {
  LokacijaCombinedReducer
} from '../components/sifarnici/lokacije/lokacije.combinedReducer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth,
    employeesCombined: employeesCombinedReducer(),
    relationsCombined: relationsCombineReducer(),
    travelingExpensesCombined: travelingExpensesCombineReducer(),
    userDetailsCombined: userDetailsCombined(),
    lokacijeCombined: lokacijeCombined()
  });
}

export type AppStore = {
  router: Reducer<RouterState<History.PoorMansUnknown>>;
  auth: any;
  employeesCombined: EmployeeCombinedReducer;
  relationsCombined: RelationCombinedReducer;
  travelingExpensesCombined: TravelingExpenseCombinedReducer;
  userDetailsCombined: UserDetailsCombinedReducer;
  lokacijeCombined: LokacijaCombinedReducer;
};
