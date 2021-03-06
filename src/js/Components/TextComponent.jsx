/**
 * Created by Fine on 2016/9/25.
 */
import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class TextComponent extends baseComponent {
  template() {
    let randomNum = new Date().getTime();

    return (
      '<div class = "widgetChild">' +
        '<div class = "widgetContainer container_' + randomNum + '">' +
          '<div class = "widgetText">' +
            '<textarea class = "placeholderText" placeholder = "文本">' +
            '</textarea>' +
          '</div>' +
        '</div>' +
        '<div class = "widgetConfig config_' + randomNum + '">text</div>' +
        '<div class = "widgetAction"></div>' +
      '</div>'
    );
  }
  initialize(html) {
    $(html).append(this.template);
  }
}
