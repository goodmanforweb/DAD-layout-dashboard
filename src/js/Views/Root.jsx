import React, { Component } from 'react';
// import { Provider } from 'react-redux';
import routes from '../Routes';
import { Router, browserHistory } from 'react-router';
// import { PropertiesManager } from '../Utils/PropertiesManager';
// import { CDFDDDatasourcesArray } from '../Utils/datasourcesArray';
// import { CDFDDComponentsArray } from '../Utils/componentsArray';

export default class Root extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    // const { store, history } = this.props;
    return (
      <Router history = { browserHistory } routes = { routes } />
    );
  }
}
