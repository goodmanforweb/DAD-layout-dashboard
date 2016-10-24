import $ from 'jquery';

class BarConfig {
  constructor() {

  }

  data() {
    let init = {
      color: '#ccc'
    };

    return init;
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
      '<label><input name="titleLocation" type="radio" value=""/>左</label>' +
      '<label><input name="titleLocation" type="radio" value=""/>中</label>' +
      '<label><input name="titleLocation" type="radio" value=""/>右</label>' +
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
      '<span>隐藏父级</span>' +
      '<label><input type="radio" name="hide"/>True</label>' +
      '<label><input type="radio" name="hide"/>False</label>' +
      '</div>' +
      '<div>' +
      '<span>可点击</span>' +
      '<label><input type="radio" name="click"/>开</label>' +
      '<label><input type="radio" name="click"/>关</label>' +
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
