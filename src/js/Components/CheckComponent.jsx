
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class CheckBoxComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetCheckBox">' +
        '<input type = "checkbox">name' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
