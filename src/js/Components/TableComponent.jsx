/**
 * Created by Fine on 2016/9/25.
 */
import $ from 'jquery';
import baseComponent from './BaseComponent';
import tableFunc from '../public/table';

export default class TableComponent extends baseComponent {
  template() {
    return tableFunc;
  }
  initialize(node) {
    $(node).append(this.template);
  }
}

