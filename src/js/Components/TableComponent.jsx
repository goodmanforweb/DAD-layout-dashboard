import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class TableComponent extends baseComponent {
  template() {
    let randomNum = new Date().getTime();

    return (
      '<div class = "widgetChild">' +
        '<div class = "widgetContainer">' +
          '<div class = "widgetTable">' +
            '<table><tr>table</tr></table>' +
          '</div>' +
        '</div>' +
        '<div class = "widgetConfig config_' + randomNum + '"></div>' +
        '<div class = "widgetAction"></div>' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
