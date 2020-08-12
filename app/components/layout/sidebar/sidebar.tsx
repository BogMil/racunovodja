import React from 'react';
import SubMenu from './components/subMenu/subMenu';
import MenuItem from './components/menuItem/menuItem';
import routes from '../../../constants/routes.json';
import styles from './sidebar.css';
import Divider from './components/divider/divider';
import StaticMenuItem from './components/staticMenuItem/staticMenuItem';
import { useDispatch } from 'react-redux';
import * as Service from '../../auth/auth.service';
import { handleResponse } from '../../../utils/responseHandler';
import { useHistory } from 'react-router-dom';
import paths from '../../../constants/routes.json';
import { unsetUser } from '../../auth/auth.actions';

export default function SideBar() {
  const history = useHistory();
  const dispatch = useDispatch();

  const onLogout = async () => {
    handleResponse(await Service.logout(), () => {
      dispatch(unsetUser());
      history.push({
        pathname: paths.LOGIN
      });
    });
  };

  return (
    <div className={styles.sidebar}>
      <ul style={{ padding: 0 }}>
        <MenuItem
          iconClassName="fa fa-home"
          navigateTo={routes.HOME}
          text="Početna"
        />
        <SubMenu text="Dodatni prihodi">
          <MenuItem navigateTo={routes.TRAVEL_EXPENSES} text="Putni troškovi" />
        </SubMenu>
        <MenuItem
          iconClassName="fa fa-users"
          navigateTo={routes.EMPLOYEES}
          text="Zaposleni"
        />
        <MenuItem
          iconClassName="fa fa-paper-plane"
          navigateTo={routes.DOSTAVLJAC_MAILOVA}
          text="Mail dostavljač"
        />
        <SubMenu text="Šifarnici">
          <MenuItem
            iconClassName="fa fa-map-marker"
            navigateTo={routes.LOCATIONS}
            text="Lokacije"
          />
          <MenuItem
            iconClassName="fa fa-route"
            navigateTo={routes.RELATIONS}
            text="Relacije"
          />
        </SubMenu>
        <MenuItem
          iconClassName="fa fa-cogs"
          navigateTo={routes.OTHER_SETTINGS}
          text="Opšti podaci"
        />
        <Divider />
        <MenuItem
          iconClassName="fa fa-parachute-box"
          navigateTo={routes.DOBAVLJACI}
          text="Dobavljači"
        />
        <Divider />
        <StaticMenuItem
          iconClassName="fa fa-sign-out-alt"
          text="Odjavi se"
          onClick={() => {
            onLogout();
          }}
        />
      </ul>
    </div>
  );
}
