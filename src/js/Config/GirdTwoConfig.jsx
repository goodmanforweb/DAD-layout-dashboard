/**
 * Created by Fine on 2016/10/13.
 */
import $ from 'jquery';

class GirdTwoConfig {
  template() {
    let html = '<div class="configSection">' +
      '<div>' +
      '<span class="closeIcon"></span><span class="titleName">布局二设置</span>' +
      '</div>' +
      '<div>' +
      '<h3>布局</h3>' +
      '<p>布局采用12等分原理，所有格子之和等于12</p>' +
      '</div>' +
      '<div class="column"><h3>列宽</h3><input type="text" value="6"/>' +
      '<input type="text" value="6"/><input class="gridConfirm" type="button" value="确定"/></div>' +
      '</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
  }

}
export default GirdTwoConfig;
