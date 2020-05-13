import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './menuItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  navigateTo: string;
  text: string;
  exact?: boolean;
  iconDefinition?: any;
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
          {props.iconDefinition && (
            <>
              <FontAwesomeIcon icon={props.iconDefinition} />{' '}
            </>
          )}
          {props.text}
        </div>
      </NavLink>
    </li>
  );
}
