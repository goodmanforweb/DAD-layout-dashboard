import $ from 'jquery';

class GirdTwoConfig {
  template() {
    let html = '<div>GirdTwoConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default GirdTwoConfig;
