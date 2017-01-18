/**
 * Created by Fine on 2016/9/25.
 */
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class RadioComponent extends baseComponent {
  template() {
    let randomNum = new Date().getTime();

    return (
      '<div class = "widgetChild">' +
        '<div class = "widgetContainer container_' + randomNum + '">' +
          '<div class = "widgetRadio">' +
            '<input type = "radio">name' +
          '</div>' +
        '</div>' +
        '<div class = "widgetConfig config_' + randomNum + '">radio</div>' +
        '<div class = "widgetAction"></div>' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
