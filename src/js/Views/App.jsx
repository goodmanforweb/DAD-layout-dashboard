/**
 * Created by Fine on 2016/8/20.
 */
import React from 'react';
import $ from 'jquery';
import autoBind from 'react-autobind';

import DoardMenu from '../DoardMenu';
import WidgetMain from '../WidgetMain';
import '../../style/Views/App';

class App extends React.Component {

  constructor(props) {
    super(props);
    autoBind(this, 'setHeight');
    $(window).resize(()=>{
      this.setHeight('.dashboardBox', 75);
    });
  }

  setHeight(name, tall) {
    let height = $(window).height();
    let node = document.querySelector(name);

    node.style.height = height - tall + 'px';
  }

  componentDidMount() {
    this.setHeight('.dashboardBox', 75);
  }

  render() {
    return (
      <div className = "dashboardBox">
        <DoardMenu setHeight={this.setHeight}/>
        <WidgetMain />
      </div>
    );
  }
};

export default App;
