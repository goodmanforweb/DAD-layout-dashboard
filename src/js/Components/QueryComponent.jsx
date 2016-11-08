/**
 * Created by Fine on 2016/9/25.
 */
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class QueryComponent extends baseComponent {
  template() {
    let randomNum = new Date().getTime();
    return (
      '<div class = "widgetChild">' +
        '<div class = "widgetContainer">' +
          '<div class = "widgetQuery">' +
            '<input type = "text">' +
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
