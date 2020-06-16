import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './menuItem.css';

type Props = {
  navigateTo: string;
  text: string;
  exact?: boolean;
  iconClassName?: string;
};

export default function MenuItem(props: Props) {
  return (
    <li className={styles.menuItemHolder}>
      <NavLink
        exact
        activeClassName={styles.activeMenuItem}
        to={props.navigateTo}
        style={{ width: '100%' }}
      >
        <div className={styles.menuItem + ' noselect'}>
          {props.iconClassName && (
            <>
              <i className={props.iconClassName}></i>{' '}
            </>
          )}
          {props.text}
        </div>
      </NavLink>
    </li>
  );
}
