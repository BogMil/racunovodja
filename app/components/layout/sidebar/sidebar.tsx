import React from 'react';
import SubMenu from './components/subMenu/subMenu';
import MenuItem from './components/menuItem/menuItem';
import routes from '../../../constants/routes.json';
import {
  faCoffee,
  faHome,
  faPaperPlane,
  faUsers,
  faSignOutAlt,
  faRoute
} from '@fortawesome/free-solid-svg-icons';
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

  const me = () => {
    Service.me();
  };

  return (
    <div className={styles.sidebar}>
      <ul style={{ padding: 0 }}>
        <MenuItem
          iconDefinition={faHome}
          navigateTo={routes.HOME}
          text="Početna"
        />
        <MenuItem
          iconDefinition={faCoffee}
          navigateTo={routes.COUNTER}
          text="brojac"
        />
        <SubMenu text="asd">
          <MenuItem navigateTo={routes.HOME} text="Pocetna" />
          <MenuItem navigateTo={routes.LOGIN} text="prijavi se" />
        </SubMenu>
        <MenuItem navigateTo={routes.HOME} text="Pocetna" />
        <MenuItem
          iconDefinition={faPaperPlane}
          navigateTo={routes.HOME}
          text="Dostavljač platnih listića"
        />
        <SubMenu text="Dodatni prihodi">
          <MenuItem navigateTo={routes.HOME} text="Putni troškovi" />
          <MenuItem navigateTo={routes.LOGIN} text="prijavi se" />
        </SubMenu>
        <MenuItem
          iconDefinition={faUsers}
          navigateTo={routes.EMPLOYEES}
          text="Zaposleni"
        />
        <SubMenu text="Šifarnici">
          <MenuItem
            iconDefinition={faRoute}
            navigateTo={routes.RELATIONS}
            text="Relacije"
          />
        </SubMenu>
        <Divider />
        <StaticMenuItem
          iconDefinition={faSignOutAlt}
          text="Odjavi se"
          onClick={() => {
            onLogout();
          }}
        />

        <StaticMenuItem
          iconDefinition={faSignOutAlt}
          text="ME"
          onClick={() => {
            me();
          }}
        />
      </ul>
    </div>
  );
}
