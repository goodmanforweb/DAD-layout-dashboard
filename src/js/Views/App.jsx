import React from 'react';
import $ from 'jquery';
import DoardMenu from '../Components/DoardMenu';
import WidgetMain from '../Components/WidgetMain';
import '../../style/Views/App';

class App extends React.Component {

  constructor(props) {
    super(props);
    $(window).resize(()=>{
      this.setHeight();
    });
  }

  setHeight() {
    let height = $(window).height();
    let dashboardBox = document.querySelector('.dashboardBox');

    dashboardBox.style.height = height - 5 + 'px';
  }

  componentDidMount() {
    this.setHeight();
  }

  render() {
    return (
      <div className = "dashboardBox">
        <DoardMenu />
        <WidgetMain />
      </div>
    );
  }
};

export default App;
