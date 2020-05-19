import React from 'react';
import SubMenu from './components/subMenu/subMenu';
import MenuItem from './components/menuItem/menuItem';
import routes from '../../../constants/routes.json';
import {
  faCoffee,
  faHome,
  faPaperPlane,
  faUsers,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.css';
import Divider from './components/divider/divider';
import StaticMenuItem from './components/staticMenuItem/staticMenuItem';
import { useDispatch } from 'react-redux';
import { logout } from '../../../components/auth/auth.actions';

export default function SideBar() {
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
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
        <Divider />
        <StaticMenuItem
          iconDefinition={faSignOutAlt}
          text="Odjavi se"
          onClick={() => {
            onLogout();
          }}
        />
      </ul>
    </div>
  );
}
