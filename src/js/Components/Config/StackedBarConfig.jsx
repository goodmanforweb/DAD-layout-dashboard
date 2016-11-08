/**
 * Created by Fine on 2016/10/13.
 */
import $ from 'jquery';

class stackedBarConfig {
  template() {
    let html = '<div>stackedBarConfig</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

  data() {
    console.log('data');
  }
}
export default stackedBarConfig;
