import React from 'react';
import { Navbar, Form } from 'react-bootstrap';
import styles from './topbar.css';
export default function TopBar() {
  return (
    <Navbar className={styles.topbar + ' noselect'}>
      <Navbar.Brand className={styles.brand}>
        Računovođa {process.env.npm_package_version}
      </Navbar.Brand>
    </Navbar>
  );
}
