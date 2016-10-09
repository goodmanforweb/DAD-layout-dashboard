import '../../style/Components/WidgetComponent';
import TextComponent from './TextComponent';
import CheckBoxComponent from './CheckComponent';
import RadioComponent from './RadioComponent';
import DateComponent from './DateComponent';
import SelectComponent from './SelectComponent';

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
