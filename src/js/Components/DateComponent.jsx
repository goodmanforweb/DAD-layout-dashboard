
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class DateComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetDate">' +
        '<input type = "date">' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
