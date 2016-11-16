/**
 * Created by Fine on 2016/10/13.
 */
import $ from 'jquery';

import DataSource from './DataSource';
import BaseConfig from './BaseConfig';

class LineConfig extends BaseConfig {
  constructor(props) {
    super(props);
  }

  template() {
    let html = '<h3>图表属性</h3>' +
      '<div>' +
      '<span>高度</span>' +
      '<label><input type="text" name="orientation" value="400"/>像素</label>' +
      '</div>' +
      '<div>' +
      '<span>轴标题</span>' +
      '<label><input type="text" name="orientation" value=""/></label>' +
      '</div>' +
      '<div>' +
      '<span>方向</span>' +
      '<label><input type="radio" name="orientation" value="vertical"/>纵向</label>' +
      '<label><input type="radio" name="orientation" value="horizontal" checked/>横向</label>' +
      '</div>' +
      '<div>' +
      '<span>动效</span>' +
      '<label><input type="radio" name="animate" value="true"/>是</label>' +
      '<label><input type="radio" name="animate" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>鼠标悬停效果</span>' +
      '<label><input type="radio" name="hoverable" value="true"/>是</label>' +
      '<label><input type="radio" name="hoverable" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>图例</span>' +
      '<label><input type="radio" name="legend" value="true"/>是</label>' +
      '<label><input type="radio" name="legend" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>图例位置</span>' +
      '<label><input type="radio" name="legendPosition" value="top"/>上</label>' +
      '<label><input type="radio" name="legendPosition" value="bottom"/>下</label>' +
      '<label><input type="radio" name="legendPosition" value="left"/>左</label>' +
      '<label><input type="radio" name="legendPosition" value="right"/>右</label>' +
      '</div>' +
      '<div>' +
      '<span>显示度量值</span>' +
      '<label><input type="radio" name="valuesVisible" value="true"/>是</label>' +
      '<label><input type="radio" name="valuesVisible" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>显示网络线</span>' +
      '<label><input type="radio" name="axisGrid" value="true" checked/>是</label>' +
      '<label><input type="radio" name="axisGrid" value="false"/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>堆叠显示</span>' +
      '<label><input type="radio" name="stacked" value="true"/>是</label>' +
      '<label><input type="radio" name="stacked" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>可点击</span>' +
      '<label><input type="radio" name="clickable" value="true"/>是</label>' +
      '<label><input type="radio" name="clickable" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>点击动作</span>' +
      '<input type="text" />' +
      '<button>...</button>' +
      '</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.baseTemplate());
    $('.chartProperty').html(this.template());
    let dataSourceComponent = new DataSource();

    dataSourceComponent.bindConfig();
  }

  bindConfig() {
    $('span.titleName').html('折线图设置');
    this.config();
  }
}

export default LineConfig;
