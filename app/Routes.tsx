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

export default function Routes() {
  const auth = useSelector((state:any)=>state.auth);
  console.log(auth)
  let isAuthenticated = auth.isAuthenticated;
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <PrivateRoute exact path={routes.HOME}>
          <HomePage />
        </PrivateRoute>
        {/* <Route path={routes.HOME} component={HomePage} /> */}
        <GuestRoute path={routes.LOGIN} component={LoginComponent} />
        <Route path={routes.REGISTER}  component={RegisterComponent} />

        <Route path={routes.SUCCESS_REGISTRATION} component={SuccessfulRegistrationComponent} />
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
}




function GuestRoute({ ...rest }: any) {
  const isAuthenticated = false;
  return isAuthenticated ==false ? <Route  {...rest} />
  : null
}

function PrivateRoute({ children, ...rest }: any) {
  const isAuthenticated = false;
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
