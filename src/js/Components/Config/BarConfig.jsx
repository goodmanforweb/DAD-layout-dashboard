import $ from 'jquery';

class BarConfig {
  constructor() {

  }

  template() {
    let html = '<div class="configSection">' +
      '<div>' +
      '<span class="closeIcon">X</span><span class="titleName">柱状图设置</span>' +
      '</div>' +
      '<div class="propertyConfig">' +
      '<div class="titleProperty">' +
      '<h3>标题属性</h3>' +
      '<div>' +
      '<span>标题</span><input type="text" class="titleContent" placeholder=""/>' +
      '</div>' +
      '<div>' +
      '<span>标题位置</span>' +
      '<label><input name="titleLocation" type="radio" class=""/>左</label>' +
      '<label><input name="titleLocation" type="radio" class=""/>中</label>' +
      '<label><input name="titleLocation" type="radio" class=""/>右</label>' +
      '</div>' +
      '</div>' +
      '<div class="dataSource">' +
      '<h3>数据来源</h3>' +
      '<span>选择查询</span>' +
      '<select>' +
      '<option value="">sqlquery</option>' +
      '<option value="">多维模型</option>' +
      '<option value="">关系模型</option>' +
      '</select>' +
      '</div>' +
      '<div class="chartProperty">' +
      '<h3>图表属性</h3>' +
      '<div>' +
      '<span>方向</span>' +
      '<label><input type="radio" name="orientation" class="vertical"/>纵向</label>' +
      '<label><input type="radio" name="orientation" class="horizontal"/>横向</label>' +
      '</div>' +
      '<div>' +
      '<span>动效</span>' +
      '<label><input type="radio" name="animate" class="true"/>是</label>' +
      '<label><input type="radio" name="animate" class="false"/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>鼠标悬停效果</span>' +
      '<label><input type="radio" name="hoverable" class="true"/>是</label>' +
      '<label><input type="radio" name="hoverable" class="false"/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>图例</span>' +
      '<label><input type="radio" name="legend" class="true"/>是</label>' +
      '<label><input type="radio" name="legend" class="false"/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>图例位置</span>' +
      '<label><input type="radio" name="legendPosition" class="top"/>上</label>' +
      '<label><input type="radio" name="legendPosition" class="bottom"/>下</label>' +
      '<label><input type="radio" name="legendPosition" class="left"/>左</label>' +
      '<label><input type="radio" name="legendPosition" class="right"/>右</label>' +
      '</div>' +
      '<div>' +
      '<span>显示度量值</span>' +
      '<label><input type="radio" name="valuesVisible" class="true"/>是</label>' +
      '<label><input type="radio" name="valuesVisible" class="false"/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>显示网络线</span>' +
      '<label><input type="radio" name="axisGrid" class="false"/>否</label>' +
      '<label><input type="radio" name="axisGrid" class="horizontal"/>横向</label>' +
      '<label><input type="radio" name="axisGrid" class="vertical"/>纵向</label>' +
      '<label><input type="radio" name="axisGrid" class="true"/>全部</label>' +
      '</div>' +
      '<div>' +
      '<span>堆叠显示</span>' +
      '<label><input type="radio" name="stacked" class="true"/>是</label>' +
      '<label><input type="radio" name="stacked" class="false"/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>可点击</span>' +
      '<label><input type="radio" name="clickable" class="true"/>是</label>' +
      '<label><input type="radio" name="clickable" class="false"/>否</label>' +
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
  }

  config() {
    $('.closeIcon').on('click', ()=>{
      $('.widgetConfig').css({display: 'none'});
    });
    $('input').unbind('click');
  }
}
export default BarConfig;
