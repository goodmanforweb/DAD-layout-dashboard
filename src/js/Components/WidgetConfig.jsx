import React from 'react';
import '../../style/Components/WidgetConfig';

class WidgetConfig extends React.Component {

  showConfig() {
    document.querySelector('.widgetConfig').style.display = 'none';
  }

  render() {
    return (
      <div className = "widgetConfig" onClick = {this.showConfig} />
	);
  }
}

export default WidgetConfig;
