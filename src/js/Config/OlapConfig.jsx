/**
 * Created by Fine on 2016/10/13.
 */
import $ from 'jquery';
import 'whatwg-fetch';
import autoBind from 'react-autobind';

class OlapConfig {
  constructor(node) {
    autoBind(this, 'olapFile', 'chooseFile', 'loopDataTree', 'fileListTemplate',
      'backBrower', 'filterFileType');
    $('.' + node).html(this.template());
    $('.olapBrowse').addClass('hide');
    this.cancleConfig(node);
    this.saveConfig(node);
    this.bindConfig(node);
  }

  template() {
    let html = '<div class="configSection">' +
      '<div class="olapProperty">' +
      '<span class="closeIcon"></span><span class="titleName">多维分析报表设置</span>' +
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
      '<span>选择文件</span>' +
      '<input type="text" class="filePath">' +
      '<input type="button" value="浏览" class="fileBrowse">' +
      '</div>' +
      '<div class="chartProperty">' +
      '<h3>图表属性</h3>' +
      '<div>' +
      '<span>高度</span>' +
      '<label><input type="text" name="" value="400"/>像素</label>' +
      '</div>' +
      '<div>' +
      '<span>可点击</span>' +
      '<label><input type="radio" name="clickable" value="true"/>是</label>' +
      '<label><input type="radio" name="clickable" value="false" checked/>否</label>' +
      '</div>' +
      '<div>' +
      '<span>隐藏父级</span>' +
      '<label><input type="radio" name="clickable" value="true"/>是</label>' +
      '<label><input type="radio" name="clickable" value="false" checked/>否</label>' +
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
      '<div class="olapBrowse">' +
      '<div class="index">' +
      '<span>位置</span>' +
      '<button class="backBtn">上一级</button>' +
      '<div class="setFilePath">/</div>' +
      '</div>' +
      '<div class="fileLists">' +
      '<div class="fileListsTitle"><span>名字</span><span>修改日期</span></div>' +
      '<ul></ul>' +
      '</div>' +
      '<div class="fileName">' +
      '<span>文件名</span>' +
      '<select class="fileType">' +
      '<option>所有文件</option>' +
      '<option>多维分析</option>' +
      '</select>' +
      '<div class="setFileName"></div>' +
      '</div>' +
      '<div class="model-btn">' +
      '<input type="button" class="cancle" value="取消" title="取消"/>' +
      '<input type="button" class="save btn" value="保存" title="保存"/>' +
      '</div>' +
      '</div>' +
      '</div>';

    return html;
  }

  loopDataTree(data, path, nodesList) {
    for (let i = 0; i < data.children.length; i++) {
      let node = data.children[i];

      if (node.file.path === path && node.children) {
        node.children.map(d=>{
          nodesList.push(d);
        });
        break;
      }
      if (node.children && node.children.length > 0) {
        this.loopDataTree(node, path, nodesList);
      }
    }
  }

  olapFile(data, node) {
    let path = null,
      folder = null,
      name = null,
      nodesList = [],
      nodes = $(node)[0].childNodes;

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].localName === 'input' ? path = nodes[i].value : null;
      nodes[i].localName === 'input' ? folder = JSON.parse(nodes[i].name) :
        (nodes[i].className === 'name' ? name = nodes[i].textContent : null);
    }
    if (folder === true) {
      $('.index .setFilePath').html(path);
      this.loopDataTree(data, path, nodesList);
      this.fileListTemplate(nodesList);
      this.chooseFile(data);
    }
    else {
      $('div.setFileName').html(name);
      $('div.setFileName').attr('param', path);
    }
  }

  chooseFile(data) {
    $('div.fileLists ul>li').on('click', (e)=>{
      this.olapFile(data, e.currentTarget);
    });
  }

  fileListTemplate(data) {
    let html = '';

    data.map(d=>{
      let date = (d.file.lastModifiedDate) ? d.file.lastModifiedDate : null;
      let path = d.file.path;

      html += '<li><span class="name">' + d.file.name + '</span><span>' + date + '</span>' +
        '<input type="hidden" name="' + d.file.folder + '" value="' + path + '" /></li>';
    });
    $('div.fileLists ul').html(html);
  }

  bindConfig(node) {
    let olapFileOpen = (data)=>{
      this.fileListTemplate(data.children);
      this.chooseFile(data);
      this.backBrower(data);
      this.filterFileType(data);
    };

    // file browse, folder and olap files are from server.
    $('input.fileBrowse').on('click', ()=>{
      $('.olapBrowse').removeClass('hide');
      $('.propertyConfig').addClass('hide');
      $('.' + node + ' span.titleName').html('浏览文件');
      $('.index .setFilePath').html('/');
      $('div.fileLists ul').html('');
      $('div.setFileName').html('');
      fetch('/xdatainsight/api/repo/files/tree?showHidden=false&filter=*.saiku|FILES', {
        credentials: 'same-origin',
        headers: new Headers({
          'Accept': 'application/json'
        })
      })
      .then(response => response.json())
      .then(data => olapFileOpen(data))
      .catch(ex => console.log('parsing fail' + ex));
    });
  }

  // filter file types about olap or all
  filterFileType(fileData) {
    $('select.fileType').on('change', (e)=>{
      let path = $('.setFilePath')[0].textContent;
      let textContent = $(e.target)[0].value;
      let nodesList = [];
      let olapList = [];

      if (path === '/') {
        fileData.children.map(d=>{
          nodesList.push(d);
        });
      }
      else {
        this.loopDataTree(fileData, path, nodesList);
      }
      nodesList.map(d=>{
        let index = d.file.name.indexOf('.saiku');

        (index > -1 && d.file.folder === 'false') ? olapList.push(d) : null;
      });
      textContent === '多维分析' ? this.fileListTemplate(olapList) : this.fileListTemplate(nodesList);
      this.chooseFile(fileData);
    });
  }

  // come back next path and brower files
  backBrower(data) {
    let nodesList = [];

    $('button.backBtn').on('click', ()=>{
      let path = $('.setFilePath')[0].textContent;
      let nextPath = path.substring(0, path.lastIndexOf('/'));

      if (nextPath) {
        this.loopDataTree(data, nextPath, nodesList);
        $('.index .setFilePath').html(nextPath);
      }
      else {
        nodesList = data.children;
        $('.index .setFilePath').html('/');
      }
      this.fileListTemplate(nodesList);
      this.chooseFile(data);
    });
  }

  cancleConfig(node) {
    $('.model-btn .cancle').on('click', ()=>{
      $('.olapBrowse').addClass('hide');
      $('.propertyConfig').removeClass('hide');
      $('.' + node + ' span.titleName').html('多维分析报表设置');
    });
  }

  saveConfig(node) {
    $('.model-btn .save').on('click', ()=>{
      let attributes = $('div.setFileName')[0].attributes;

      for (let j = 0; j < attributes.length; j++) {
        attributes[j].name === 'param' ?
          $('.' + node + ' .dataSource .filePath').attr('value', attributes[j].nodeValue) : null;
      }
      $('.olapBrowse').addClass('hide');
      $('.propertyConfig').removeClass('hide');
      $('.' + node + ' span.titleName').html('多维分析报表设置');
    });
  }
}
export default OlapConfig;
