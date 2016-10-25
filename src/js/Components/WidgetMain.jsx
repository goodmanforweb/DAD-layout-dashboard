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
        <div className = "footer">
          <input type = "button" value = "另存为"/>
          <input type = "button" value = "保存"/>
        </div>
      </div>
    );
  }
}

export default WidgetMain;
