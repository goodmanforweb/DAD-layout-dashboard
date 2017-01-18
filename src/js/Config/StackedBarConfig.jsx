/**
 * Created by Fine on 2016/10/13.
 */
import $ from 'jquery';

import DataSource from './DataSource';

class stackedBarConfig {

  template() {
    let html = '<div class="configSection">' +
      '<div>' +
      '<span class="closeIcon"></span><span class="titleName">堆积柱状图设置</span>' +
      '<span class="newquery">新建查询</span>' +
      '</div>' +
      '<div class="propertyConfig">' +
      '<div class="titleProperty">' +
      '<h3>标题属性</h3>' +
      '<div>' +
      '<span>标题</span><input type="text" name="titleContent" placeholder="请输入"/>' +
      '</div>' +
      '<div>' +
      '<span>标题位置</span>' +
      '<label><input type="radio" name="headlines" value="left"/>左</label>' +
      '<label><input type="radio" name="headlines" value="center"/>中</label>' +
      '<label><input type="radio" name="headlines" value="right"/>右</label>' +
      '</div>' +
      '</div>' +
      '<div class="dataSource">' +
      '<h3>数据来源</h3>' +
      '<span>选择查询</span>' +
      '<select class="data">' +
      '<option value="dataSource">选择查询</option>' +
      '<option value="dataSource">创建新查询</option>' +
      '</select>' +
      '</div>' +
      '<div class="chartProperty">' +
      '<h3>图表属性</h3>' +
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
      '</div>' +
      '</div>' +
      '<div class="chartParameter">' +
      '<div><h3>图表参数</h3><h3>+</h3><h3>x</h3></div>' +
      '<ul>' +
      '<li><span><input type="checkbox"/></span><span>变量</span><span>监听值的变化</span></li>' +
      '<li><span><input type="checkbox"/></span>' +
      '<span>parameter</span><span><input type="checkbox"/></span></li>' +
      '<li><span><input type="checkbox"/></span>' +
      '<span>parameter</span><span><input type="checkbox"/></span></li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>';

    return html;
  }

  renderConfig(node) {
    $('.' + node).html(this.template());
    let dataSourceComponent = new DataSource();

    dataSourceComponent.bindConfig(node);
  }

  bindConfig() {
    $('.newquery').addClass('hide');
    $('.dataSourceConfig').addClass('hide');
  }
}

export default stackedBarConfig;
