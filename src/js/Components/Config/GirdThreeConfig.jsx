import $ from 'jquery';

class GirdThreeConfig {
  template() {
    let html = '<div>GirdThreeConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default GirdThreeConfig;
