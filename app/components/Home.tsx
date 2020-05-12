import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function Home() {
  return (
    <div >
      <h2>Home 4</h2>
      <Link to={routes.COUNTER}>to Counter</Link>
    </div>
  );
}
