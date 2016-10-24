import $ from 'jquery';

class DateConfig {
  template() {
    let html = '<div>DateConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default DateConfig;
