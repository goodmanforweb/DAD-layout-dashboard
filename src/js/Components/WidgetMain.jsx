import React from 'react';
import '../../style/Components/WidgetMain';
import WidgetConfig from './WidgetConfig';
import WidgetPreview from './WidgetPreview';

class WidgetMain extends React.Component {

  render() {
    return (
      <div className = "widgetMain">
        <WidgetPreview />
        <WidgetConfig />
      </div>
	);
  }
}

export default WidgetMain;
