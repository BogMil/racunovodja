import React from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import styles from './topbar.css';
export default function TopBar() {
  let v = require('electron').remote.app.getVersion();
  const close = () => {
    let window = require('electron').remote.getCurrentWindow();
    window.close();
  };

  const minimize = () => {
    let window = require('electron').remote.getCurrentWindow();
    window.minimize();
  };
  return (
    <Navbar className={styles.topbar + ' noselect'}>
      <Navbar.Brand className={styles.brand}>Shone kralj {v}</Navbar.Brand>
      <div style={{ position: 'absolute', right: 0, top: -2 }}>
        <Button onClick={minimize} variant="light" className={styles.btn}>
          <i className="fa fa-minus" />
        </Button>
        <Button onClick={close} variant="light" className={styles.btn}>
          <i className="fa fa-times" />
        </Button>
      </div>
    </Navbar>
  );
}
