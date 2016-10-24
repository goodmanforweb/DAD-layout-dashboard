import React from 'react';

import '../../style/Components/WidgetMain';
import WidgetPreview from './WidgetPreview';

class WidgetMain extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className = "widgetMain">
        <WidgetPreview />
      </div>
	);
  }
}

export default WidgetMain;
