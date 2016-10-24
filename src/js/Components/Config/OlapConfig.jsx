import $ from 'jquery';

class OlapConfig {
  template() {
    let html = '<div>OlapConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default OlapConfig;
