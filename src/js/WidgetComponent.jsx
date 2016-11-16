/**
 * Created by Fine on 2016/9/12.
 */

import '../style/Components/WidgetComponent';
import TableComponent from './Components/TableComponent';
import TextComponent from './Components/TextComponent';
import CheckBoxComponent from './Components/CheckComponent';
import RadioComponent from './Components/RadioComponent';
import DateComponent from './Components/DateComponent';
import SelectComponent from './Components/SelectComponent';

export default function widgetComponent(options) {
  let componentType = {
    text() {
      let textWidget = new TextComponent();

      textWidget.initialize(options.node);
    },
    query() {
      console.log('query');
    },
    table() {
      let tableWidget = new TableComponent();

      tableWidget.initialize(options.node);
      console.log('table');
    },
    checkBox() {
      let checkBoxWidget = new CheckBoxComponent();

      checkBoxWidget.initialize(options.node);
    },
    radio() {
      let radioWidget = new RadioComponent();

      radioWidget.initialize(options.node);
    },
    select() {
      let selectWidget = new SelectComponent();

      selectWidget.initialize(options.node);
    },
    date() {
      let dateWidget = new DateComponent();

      dateWidget.initialize(options.node);
    }
  };

  return componentType[options.type] ? componentType[options.type]() : null;
}
