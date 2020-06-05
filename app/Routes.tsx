import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginComponent from './components/auth/login/login';
import RegisterComponent from './components/auth/register/register';
import SuccessfulRegistrationComponent from './components/auth/register/success';
import { useSelector } from 'react-redux';
import Employees from './components/employees/employees';
import Relations from './components/relations/relations';
import TravelExpenses from './components/travelingExpenses/travelingExpenses';
import TravelExpensesDetails from './components/travelingExpenses/components/details/details';

export default function Routes() {
  const auth = useSelector((state: any) => state.auth);
  let isAuthenticated = auth.isAuthenticated;
  return (
    <App>
      <Switch>
        <PrivateRoute exact path={routes.HOME}>
          <HomePage />
        </PrivateRoute>
        <GuestRoute path={routes.LOGIN} component={LoginComponent} />
        <Route path={routes.REGISTER} component={RegisterComponent} />
        <Route
          path={routes.SUCCESS_REGISTRATION}
          component={SuccessfulRegistrationComponent}
        />
        <PrivateRoute path={routes.EMPLOYEES}>
          <Employees />
        </PrivateRoute>
        <PrivateRoute exact path={routes.RELATIONS}>
          <Relations />
        </PrivateRoute>
        <PrivateRoute exact path={routes.TRAVEL_EXPENSES}>
          <TravelExpenses />
        </PrivateRoute>

        <PrivateRoute path={routes.TRAVEL_EXPENSES_DETAILS + '/:id'}>
          <TravelExpensesDetails />
        </PrivateRoute>
      </Switch>
    </App>
  );

  function PrivateRoute({ children, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: routes.LOGIN,
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  function GuestRoute({ ...rest }: any) {
    return isAuthenticated ? (
      <Redirect to={routes.HOME} />
    ) : (
      <Route {...rest} />
    );
  }
}
