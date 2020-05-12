import React, { ReactNode } from 'react';
import SideBar from './sidebar/sidebar';
import TopBar from './topbar/topbar';
import { useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';

export default function Layout(props:{children:ReactNode}) {

  const history=useHistory();

  const auth = useSelector((state:any)=>state.auth);
  if(auth.isAuthenticated)
  return (
    <div>
      <TopBar />
      <div>
          <SideBar/>
          <main style={{marginLeft:200}}>
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
          <main>
            {props.children}
          </main>
      </div>
    </div>
  );

}
