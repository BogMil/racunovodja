import React from 'react';
import styles from './staticMenuItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  text: string;
  exact?: boolean;
  iconDefinition?: any;
  onClick: Function;
};

export default function StaticMenuItem(props: Props) {
  return (
    <li className={styles.staticMenuItemHolder} onClick={props.onClick}>
      <div style={{ width: '100%' }}>
        <div className={styles.staticMenuItem + ' noselect'}>
          {props.iconDefinition && (
            <>
              <FontAwesomeIcon icon={props.iconDefinition} />{' '}
            </>
          )}
          {props.text}
        </div>
      </div>
    </li>
  );
}
