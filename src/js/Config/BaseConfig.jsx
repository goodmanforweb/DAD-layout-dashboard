/**
 * Created by Fine on 2016/11/9.
 */
import $ from 'jquery';

export default class BaseConfig {
  constructor() {

  }

  baseTemplate() {
    let html = '<div class="configSection">' +
      '<div>' +
      '<span class="closeIcon"></span><span class="titleName"></span>' +
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

  config() {
    $('.closeIcon').on('click', ()=>{
      $('.widgetConfig').addClass('hide');
    });
    $('.newquery').addClass('hide');
    $('.dataSourceConfig').addClass('hide');
    // $('input').unbind('click');
  }
}
