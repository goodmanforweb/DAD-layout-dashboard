/**
 * Created by Fine on 2016/8/20.
 */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './js/Views/App';

render(
  <Router history = {browserHistory}>
    <Route path = "/xdatainsight/dashboard/index.html" component={App} />
	<Route path = "/" component={App} />
  </Router>,
  document.querySelector('#xdtDashboard')
);
