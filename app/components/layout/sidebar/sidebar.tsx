import React from 'react';
import SubMenu from './components/subMenu/subMenu';
import MenuItem from './components/menuItem/menuItem';
import routes from '../../../constants/routes.json';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import styles from './sidebar.css';


export default function SideBar() {
  return (
    <div className={styles.sidebar}>
       <ul style={{padding:0}}>
         <MenuItem iconDefinition={faCoffee} navigateTo={routes.COUNTER} text="brojac" />
         <MenuItem navigateTo={routes.HOME} text="Pocetna" />
         <MenuItem navigateTo={routes.LOGIN} text="prijavi se" />
         <SubMenu text="asd">
         <MenuItem navigateTo={routes.LOGIN} text="prijavi se" />
         <MenuItem navigateTo={routes.HOME} text="Pocetna" />
         <MenuItem navigateTo={routes.LOGIN} text="prijavi se" />
         </SubMenu>
         <MenuItem navigateTo={routes.HOME} text="Pocetna" />

       </ul>
      </div>
  );

  }
