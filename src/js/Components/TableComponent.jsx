import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class TableComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetTable">' +
        '<input type = "text">' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
