/**
 * Created by Fine on 2016/11/8.
 */
import $ from 'jquery';
import 'whatwg-fetch';

// new data source component
export default class DataSource {

  template() {
    let child = '<div class="dataSourceConfig">' +
      '<div><label>数据源名称</label>' +
      '<input type="text" class="sourceName" placeholder="输入数据源名称"/></div>' +
      '<div><label>数据源类别</label><select class="queryType">' +
      '<option value="mdx">Mdx查询</option>' +
      '<option value="sql">Sql查询</option>' +
      '</select></div>' +
      '<div><label>数据源连接</label><select class="sourceConnect"></select></div>' +
      '<div><label>多维数据集</label><select class="dataCubes"></select></div>' +
      '<div><label class="sqlQuery">Mdx查询</label><textarea rows="10" class="sqlStatement">' +
      '</textarea></div>' +
      '<div class="queryParam"><span>查询参数</span><ul class="queryParamList">' +
      '<li><span><input type="checkbox" /></span><span>变量名</span><span>默认值</span></li>' +
      '</ul><span class="rightNowQuery">立即查询</span></div>' +
      '<div class="responseParam"><span>输出列</span><ul>' +
      '<li><span><input type="checkbox" /></span><span>序列号</span><span>列名</span></li>' +
      '<li><span><input type="checkbox" /></span><span>0</span><input type="text"/></li>' +
      '<li><span><input type="checkbox" /></span><span>0</span><input type="text"/></li>' +
      '</ul></div>' +
      '<div class="saveButton"><input type="button" class="cancleCommit" value="取消"/>' +
      '<input type="button" class="saveDataSource" value="保存"/></div>' +
      '</div>';

    return child;
  }

  databaseSource() {
    this.databaseConnections = null;
    this.dataCubes = null;
    let data = {
      databaseConnections: this.databaseConnections,
      dataCubes: this.dataCubes
    };

    return data;
  }

  bindConfig(node) {
    $('.' + node + ' .configSection').append(this.template());
    $('input.cancleCommit').on('click', ()=>{
      $('.newquery').addClass('hide');
      $('.titleName').removeClass('hide');
      $('.dataSourceConfig').addClass('hide');
      $('.propertyConfig').removeClass('hide');
      let nodes = $('select.data')[0];

      for (let i = 0; i < nodes.length; i++) {
        $(nodes[i]).removeAttr('selected');
        $(nodes[0]).attr('selected', 'selected');
      }
    });
    $('select.queryType').on('change', (e)=>{
      let nodeList = $(e.target)[0];

      for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].selected === true ? $('label.sqlQuery').html(nodeList[i].innerText) : null;
        (nodeList[i].selected === true && nodeList[i].innerText === 'Sql查询') ?
          $('select.dataCubes').attr('disabled', 'disabled') : null;
        (nodeList[i].selected === true && nodeList[i].innerText === 'Mdx查询') ?
          $('select.dataCubes').removeAttr('disabled') : null;
      };
    });
    $('.dataSource .data').on('change', (ev)=>{
      let nodeList = $(ev.target)[0];

      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].selected === true && nodeList[i].innerHTML === '创建新查询') {
          $('.newquery').removeClass('hide');
          $('.dataSourceConfig').removeClass('hide');
          $('.propertyConfig').addClass('hide');

          fetch('/xdatainsight/plugin/saiku/api/admin/discover', {
            credentials: 'same-origin',
            headers: new Headers({
              'Accept': 'application/json'
            })
          })
          .then(response => response.json())
          .then(json => {
            this.dataCubes = json;
            let nodes = null;

            json.map(d => {
              nodes += '<option value="' + d.name + '">' + d.name + '</option>';
            });
            $('select.dataCubes').html(nodes);
          })
          .catch(ex => console.log('parsing failed', ex));

          fetch('/xdatainsight/plugin/data-access/api/connection/list', {
            credentials: 'same-origin',
            headers: new Headers({
              'Accept': 'application/json'
            })
          })
          .then(response => response.json())
          .then(json => {
            this.databaseConnections = json;
            let nodes = null;

            json.databaseConnections.map(d=>{
              nodes += '<option value="' + d.name + '">' + d.name + '</option>';
            });
            $('select.sourceConnect').html(nodes);
          })
          .catch(ex => console.log('parsing failed', ex));
        }
      }
    });
  }
}
