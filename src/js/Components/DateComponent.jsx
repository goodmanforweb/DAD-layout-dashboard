/**
 * Created by Fine on 2016/9/25.
 */
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class DateComponent extends baseComponent {
  template() {
    let randomNum = new Date().getTime();

    return (
      '<div class = "widgetChild">' +
        '<div class = "widgetContainer container_' + randomNum + '">' +
          '<div class = "widgetDate">' +
            '<input type = "date">' +
          '</div>' +
        '<div class = "widgetConfig config_' + randomNum + '">Date</div>' +
        '<div class = "widgetAction"></div>' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
