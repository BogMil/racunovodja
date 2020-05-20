import React, { ReactNode, useEffect, useState } from 'react';
import SideBar from './sidebar/sidebar';
import TopBar from './topbar/topbar';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import routes from '../../constants/routes.json';
import { useHistory } from 'react-router-dom';
import { getToken } from '../../utils/tokenService';
import * as Service from '../auth/auth.service';
import { handleResponse } from '../../utils/responseHandler';
import { setUser } from '../auth/auth.actions';

export default function Layout(props: { children: ReactNode }) {
  const [isRefreshed, setIsRefreshed] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector((state: any) => state.auth);
  const vh = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  useEffect(() => {
    async function refreshToken() {
      handleResponse(
        await Service.refresh(),
        (res: any) => {
          dispatch(setUser(res.data.user, res.data.jwt));
          setIsRefreshed(true);
        },
        () => {
          setIsRefreshed(true);
        },
        () => {
          setIsRefreshed(true);
        }
      );
    }

    refreshToken();
  }, []);

  useEffect(() => {}, [isRefreshed]);
  debugger;

  if (!isRefreshed) {
    return null;
  }

  if (isRefreshed) {
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
                paddingBottom: 25,
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
