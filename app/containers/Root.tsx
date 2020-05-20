import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../reducers/types';
import Routes from '../Routes';
import Layout from '../components/layout/layout';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Layout>
          <Routes />
        </Layout>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);
