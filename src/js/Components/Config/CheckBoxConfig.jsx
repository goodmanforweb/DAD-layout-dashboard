import $ from 'jquery';

class CheckBoxConfig {
  template() {
    let html = '<div>CheckBoxConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default CheckBoxConfig;
