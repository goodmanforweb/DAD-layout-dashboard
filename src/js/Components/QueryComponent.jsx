import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class QueryComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetQuery">' +
        '<input type = "text">' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
