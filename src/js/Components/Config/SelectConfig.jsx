import $ from 'jquery';

class SelectConfig {
  template() {
    let html = '<div>SelectConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default SelectConfig;
