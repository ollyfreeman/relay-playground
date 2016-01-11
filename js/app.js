import 'babel-polyfill';

import App from './components/App';
import UserRoute from './routes/UserRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { getParameterByName } from './utils/url';

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new UserRoute({userId: getParameterByName('userId')})}
  />,
  document.getElementById('root')
);
