import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import LoginComponent from './components/auth/login/index';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <PrivateRoute exact path={routes.HOME}>
          <HomePage />
        </PrivateRoute>
        {/* <Route path={routes.HOME} component={HomePage} /> */}
        <Route path={routes.LOGIN} component={LoginComponent} />
      </Switch>
    </App>
  );
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
