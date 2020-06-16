import React from 'react';
import styles from './staticMenuItem.css';

type Props = {
  text: string;
  exact?: boolean;
  iconClassName?: string;
  onClick: Function;
};

export default function StaticMenuItem(props: Props) {
  return (
    <li className={styles.staticMenuItemHolder} onClick={props.onClick}>
      <div style={{ width: '100%' }}>
        <div className={styles.staticMenuItem + ' noselect'}>
          {props.iconClassName && (
            <>
              <i className={props.iconClassName} />{' '}
            </>
          )}
          {props.text}
        </div>
      </div>
    </li>
  );
}
