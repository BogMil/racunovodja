import React, { useEffect, useState } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styles from './topbar.css';
import routes from '../../../constants/routes.json';

export default function TopBar() {
  let v = require('electron').remote.app.getVersion();
  const [numberOfNewNotifications, setNumberOfNewNotifications] = useState(0);
  const close = () => {
    let window = require('electron').remote.getCurrentWindow();
    window.close();
  };

  const minimize = () => {
    let window = require('electron').remote.getCurrentWindow();
    window.minimize();
  };

  // useEffect(() => {
  //   let polling = setInterval(longPolling, 5000);

  //   return () => {
  //     clearInterval(polling);
  //   };
  // });

  // const longPolling = () => {
  //   setNumberOfNewNotifications(1);
  // };
  // let notificationBellCollor =
  //   numberOfNewNotifications > 0 ? '#FFB733' : '#b7a5b7';

  return (
    <Navbar className={styles.topbar + ' noselect'}>
      <Navbar.Brand className={styles.brand}> {v}</Navbar.Brand>
      <div style={{ position: 'absolute', right: 0, top: -2 }}>
        {/* <NavLink
          to={routes.NOTIFIKACIJE}
          style={{ paddingRight: 20, height: 25 }}
        >
          <i style={{ color: notificationBellCollor }} className="fa fa-bell" />
          {numberOfNewNotifications > 0 && (
            <span
              className="badge"
              style={{
                position: 'absolute',
                top: 2,
                color: notificationBellCollor
              }}
            >
              {numberOfNewNotifications}
            </span>
          )}
        </NavLink> */}
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
