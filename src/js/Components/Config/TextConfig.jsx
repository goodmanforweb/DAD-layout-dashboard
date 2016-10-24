import $ from 'jquery';

class TextConfig {
  template() {
    let html = '<div>TextConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default TextConfig;
