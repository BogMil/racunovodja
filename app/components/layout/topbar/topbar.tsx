import React from 'react';
import {Navbar} from 'react-bootstrap';
import styles from './topbar.css'
export default function TopBar() {
  return (
    <Navbar className={styles.topbar + " noselect"}>
      <Navbar.Brand className={styles.brand}>
        Računovođa
      </Navbar.Brand>
  </Navbar>
  );
}
