/**
 * Created by Fine on 2016/11/8.
 */
import $ from 'jquery';

export default class DataSource {

  template() {
    let child = '<div class="dataSourceConfig">' +
      '<div><label>数据源名称</label><input type="text" /></div>' +
      '<div><label>数据源类别</label><select></select></div>' +
      '<div><label>数据源连接</label><select></select></div>' +
      '<div><label>多维数据集</label><select></select></div>' +
      '<div><label class="sqlQuery">Sql查询</label><textarea rows="10"></textarea></div>' +
      '<div><span>输出列</span><ul>' +
      '<li><span><input type="checkbox" /></span><span>序列号</span><span>列名</span></li>' +
      '<li><span><input type="checkbox" /></span><span>0</span><span>地区</span></li>' +
      '<li><span><input type="checkbox" /></span><span>0</span><span>销售额</span></li>' +
      '</ul></div>' +
      '<div class="saveButton"><input type="button" class="cancleCommit" value="取消"/>' +
      '<input type="button" class="save" value="保存"/></div>' +
      '</div>';

    return child;
  }

  bindConfig() {
    $('.configSection').append(this.template());
    $('input.cancleCommit').on('click', ()=>{
      $('.newquery').addClass('hide');
      $('.titleName').removeClass('hide');
      $('.dataSourceConfig').addClass('hide');
      $('.propertyConfig').removeClass('hide');
    });
  }
}
