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
