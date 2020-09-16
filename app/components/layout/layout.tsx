import React, { ReactNode, useEffect, useState } from 'react';
import SideBar from './sidebar/sidebar';
import TopBar from './topbar/topbar';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import * as Service from '../auth/auth.service';
import { handleResponse } from '../../utils/responseHandler';
import { setUser } from '../auth/auth.actions';
import { setToken } from '../../utils/tokenService';

export default function Layout(props: { children: ReactNode }) {
  const [isRefreshed, setIsRefreshed] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector((state: any) => state.auth);
  const vh = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  useEffect(() => {
    refreshAuthState();
  }, []);

  async function refreshAuthState() {
    await refreshJwt();
    await refreshKorisnika();
    setIsRefreshed(true);
  }

  const refreshJwt = async () => {
    handleResponse(await Service.refresh(), (response: any) => {
      setToken(response.data.jwt);
    });
  };

  const refreshKorisnika = async () => {
    handleResponse(await Service.me(), (response: any) => {
      dispatch(setUser(response.data.korisnik));
    });
  };

  if (!isRefreshed) {
    return <div>Loading...</div>;
  } else {
    if (auth.isAuthenticated) {
      return (
        <div>
          <TopBar />
          <div>
            <SideBar />
            <main
              style={{
                marginLeft: 200,
                height: vh - 25,
                overflowX: 'auto',
                overflowY: 'auto'
              }}
            >
              {props.children}
            </main>
          </div>
        </div>
      );
    }

    return (
      <div>
        <TopBar />
        <div>
          <Container
            fluid
            style={{
              height: vh - 25,
              padding: 10,
              overflowX: 'auto',
              overflowY: 'auto'
            }}
          >
            {props.children}
          </Container>
        </div>
      </div>
    );
  }
}
