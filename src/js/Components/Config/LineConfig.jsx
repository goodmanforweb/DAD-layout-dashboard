import $ from 'jquery';

class LineConfig {
  template() {
    let html = '<div>LineConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default LineConfig;
