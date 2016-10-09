
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './js/Views/Root';
// import { browserHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';

// const store = configureStore();
// const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root />,
  document.querySelector('#xdtDashboard')
);
