import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import LoginComponent from './components/auth/login/login';
import RegisterComponent from './components/auth/register/register';
import SuccessfulRegistrationComponent from './components/auth/register/success';
import { useSelector } from 'react-redux';
import Employees from './components/employees/employees';

export default function Routes() {
  const auth = useSelector((state:any)=>state.auth);
  let isAuthenticated = auth.isAuthenticated;
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <PrivateRoute exact path={routes.HOME}>
          <HomePage />
        </PrivateRoute>
        <GuestRoute path={routes.LOGIN} component={LoginComponent} />
        <Route path={routes.REGISTER}  component={RegisterComponent} />
        <Route path={routes.SUCCESS_REGISTRATION} component={SuccessfulRegistrationComponent} />
        <Route path={routes.EMPLOYEES} component={Employees} />
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
    return isAuthenticated
    ? <Redirect to={routes.HOME} /> 
    : <Route  {...rest} />
  }
}


