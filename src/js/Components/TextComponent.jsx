import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class TextComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetText">' +
        '<textarea class = "placeholderText" placeholder = "文本"></textarea>' +
      '</div>'
    );
  }
  initialize(html) {
    $(html).append(this.template);
  }
}
