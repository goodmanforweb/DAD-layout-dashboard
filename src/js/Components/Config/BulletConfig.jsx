import $ from 'jquery';

class BulletConfig {
  template() {
    let html = '<div>bulletConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default BulletConfig;
