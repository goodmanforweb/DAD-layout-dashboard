import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class SelectComponent extends baseComponent {
  template() {
    let randomNum = new Date().getTime();

    return (
      '<div class = "widgetChild">' +
        '<div class = "widgetContainer">' +
          '<div class = "widgetSelect">' +
            '<select>' +
            '<option value ="bar">bar</option>' +
            '<option value ="line">line</option>' +
            '<option value="bullet">bullet</option>' +
            '<option value="sunburst">sunburst</option>' +
            '</select>' +
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
