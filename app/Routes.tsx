import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginComponent from './components/auth/login';
import RegisterComponent from './components/auth/register';
import SuccessfulRegistrationComponent from './components/auth/success';
import { useSelector } from 'react-redux';
import Employees from './components/zaposleni/zaposleni';
import Relations from './components/sifarnici/relations/relations';
import TravelExpenses from './components/travelingExpenses/travelingExpenses';
import TravelExpensesDetails from './components/travelingExpenses/components/details/details';
import UserDetailsComponent from './components/userDetails/userDetails';
import LokacijeComponent from './components/sifarnici/lokacije/lokacije';
import DostavljacMailovaComponent from './components/dostavljacMailova/dostavljacMailova';
import IzborZaposlenihZaSlanje from './components/dostavljacMailova/izborZaposlenihZaSlanje';
import SlanjeMailovaComponent from './components/dostavljacMailova/slanjeMailova';
import DobavljaciComponent from './components/dobavljaci/dobavljaci.component';
import DobavljacDetaljiComponent from './components/dobavljaci/components/detaljiDobavljaca/detaljiDobavljaca.component';

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

        <PrivateRoute path={routes.OTHER_SETTINGS}>
          <UserDetailsComponent />
        </PrivateRoute>
        <PrivateRoute path={routes.LOCATIONS}>
          <LokacijeComponent />
        </PrivateRoute>
        <PrivateRoute path={routes.DOSTAVLJAC_MAILOVA}>
          <DostavljacMailovaComponent />
        </PrivateRoute>
        <PrivateRoute path={routes.DOSTAVLJAC_MAILOVA_IZBOR_ZAPOSLENIH}>
          <IzborZaposlenihZaSlanje />
        </PrivateRoute>
        <PrivateRoute path={routes.DOSTAVLJAC_MAILOVA_SLANJE}>
          <SlanjeMailovaComponent />
        </PrivateRoute>

        {/* -------------------------DOBAVLJACI------------------------- */}
        <PrivateRoute path={routes.DOBAVLJACI}>
          <DobavljaciComponent />
        </PrivateRoute>
        <PrivateRoute path={routes.DETALJI_DOBAVLJACA + '/:id'}>
          <DobavljacDetaljiComponent />
        </PrivateRoute>
        {/* -------------------------DOBAVLJACI------------------------- */}
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
