import React, { ReactNode } from 'react';
import SideBar from './sidebar/sidebar';
import TopBar from './topbar/topbar';
import { useSelector } from 'react-redux';

export default function Layout(props: { children: ReactNode }) {
  const auth = useSelector((state: any) => state.auth);
  if (auth.isAuthenticated)
    return (
      <div>
        <TopBar />
        <div>
          <SideBar />
          <main
            style={{ marginLeft: 200, height: '100vh', overflowX: 'scroll' }}
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
        <main style={{ height: '100vh' }}>{props.children}</main>
      </div>
    </div>
  );
}
