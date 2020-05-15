import React, { ReactNode } from 'react';
import SideBar from './sidebar/sidebar';
import TopBar from './topbar/topbar';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

export default function Layout(props: { children: ReactNode }) {
  const auth = useSelector((state: any) => state.auth);
  const vh = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  if (auth.isAuthenticated)
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

  // history.push(routes.LOGIN)
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
