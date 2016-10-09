
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class RadioComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetRadio">' +
        '<input type = "radio">name' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
