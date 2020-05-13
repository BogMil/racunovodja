import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counter from './counter';
import auth from '../components/auth/auth.reducer';
import employeesCombinedReducer from '../components/employees/combinedReducer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    auth,
    employees: employeesCombinedReducer()
  });
}
