import $ from 'jquery';

class QueryConfig {
  template() {
    let html = '<div>QueryConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default QueryConfig;
