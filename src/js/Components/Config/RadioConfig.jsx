import $ from 'jquery';

class RadioConfig {
  template() {
    let html = '<div>RadioConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default RadioConfig;
