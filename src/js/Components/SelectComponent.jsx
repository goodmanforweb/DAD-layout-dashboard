import $ from 'jquery';
import baseComponent from './BaseComponent';

export default class SelectComponent extends baseComponent {
  template() {
    return (
      '<div class = "widgetSelect">' +
        '<select>' +
        '<option value ="bar">bar</option>' +
        '<option value ="line">line</option>' +
        '<option value="bullet">bullet</option>' +
        '<option value="sunburst">sunburst</option>' +
        '</select>' +
      '</div>'
    );
  }
  initialize(node) {
    $(node).append(this.template);
  }
}
