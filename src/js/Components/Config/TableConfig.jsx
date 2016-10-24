
import $ from 'jquery';

class TableConfig {
  template() {
    let html = '<div>TableConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default TableConfig;
