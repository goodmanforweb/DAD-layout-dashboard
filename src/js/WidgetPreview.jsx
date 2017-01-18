/**
 * Created by Fine on 2016/8/25.
 */
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import d3 from './public/d3';
import $ from 'jquery';

import ChartComponent from './ChartComponent';
import widgetComponent from './WidgetComponent';
import WidgetConfig from './WidgetConfig';
import switchOlapChart from './SwitchOlapChart';

import '../style/Components/WidgetPreview';
import '../style/Components/WidgetConfig';

'use strict';
// WidgetPreview object about layout
class WidgetPreview extends Component {

  constructor(props) {
    super(props);
    autoBind(this, 'drop', 'proxyClick', 'chartProperty', 'setWidgetConfig',
      'dataSource', 'initGridConfig', 'chartDataSource', 'selectDataSource',
      'chartLegendPosition');
    this.dataSourceNames = [];
    this.chartParameters = [];
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  // drop Chart、grid、olapPlugin and html components in widgetPreview to render
  drop(ev) {
    ev.preventDefault();
    $('.mainAction').removeClass('hidden');
    $('.columnOne, .columnTwo, .columnThree').css({
      borderColor: '#B7B7B7'
    });
    this.dropOption(ev);
    let name = ev.target.className.split(' ')[1];
    let kids = ev.target.childNodes;
    let nodeName = (kids[kids.length - 1].childNodes[1].className).split(' ')[1];

    this.setWidgetConfig(nodeName);
    $('.widgetPreview').css({
      background: 'none'
    });
    $('.' + name).css({
      borderColor: '#7ABAEF'
    });
    $('svg').on('click', (ev)=>{
      var cntName = ev.target.parentNode.parentNode;
      var className = cntName.parentNode.parentNode.className.split(' ')[1];
      var config = 'config_' + cntName.className.split('_')[1];

      $('.columnOne, .columnTwo, .columnThree').css({
        borderColor: '#B7B7B7'
      });
      $('.widgetConfig').addClass('hide');
      $('.' + className).css({
        borderColor: '#7ABAEF'
      });
      $('.' + config).removeClass('hide');
    });
    $('input[type="text"]').on('blur', (e)=>{
      this.proxyblur(e);
    });
  }

  dropOption(ev) {
    let dataType = ev.dataTransfer.getData('Text');

    if (dataType.indexOf('Chart') > -1) {
      this.dropCharts(ev);
    }
    else if (dataType.indexOf('grid') > -1) {
      this.dropGrid(ev);
    }
    else if (dataType === 'olapPlugin') {
      this.dropOlapPlugin(ev);
    }
    else {
      this.dropComponents(ev);
    }
  }

  dropComponents(ev) {
    let dataType = ev.dataTransfer.getData('Text');
    let options = {
      type: dataType,
      node: ev.target
    };

    widgetComponent(options);
    let componentsNodes = ev.target.childNodes[0].childNodes[0].childNodes;

    for (let n = 0; n < componentsNodes.length; n++) {
      let name = (componentsNodes[n].className).split(' ')[1];

      (componentsNodes[n].className).indexOf('widgetConfig') > -1 ?
        WidgetConfig(dataType, name) : null;
    }
  }

  dropOlapPlugin(ev) {
    let dataType = ev.dataTransfer.getData('Text');
    let childNodeList = [];

    $(ev.target).html(this.layoutDom('gridChart'));
    let targetChild = ev.target.childNodes[ev.target.childNodes.length - 1];

    for (let n = 0; n < targetChild.childNodes.length; n++) {
      let name = (targetChild.childNodes[n].className).split(' ')[1];

      (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
        WidgetConfig(dataType, name) : null;
    }
    let obj = {
      type: dataType,
      node: targetChild.childNodes
    };

    switchOlapChart(obj);
    ev.target.className === 'widgetPreview' ?
      null : childNodeList = ev.target.parentNode.childNodes;
    for (let l = 0;l < childNodeList.length;l++) {
      childNodeList[l].style.minHeight =
        ev.target.offsetHeight + 'px';
    }
    ev.target.parentNode.style.minHeight =
      ev.target.offsetHeight + 'px';
  }

  dropGrid(ev) {
    let dataType = ev.dataTransfer.getData('Text');

    $(ev.target).append(this.layoutDom(dataType));
    let targetChild = ev.target.childNodes[ev.target.childNodes.length - 1];

    for (let n = 0; n < targetChild.childNodes.length; n++) {
      let name = (targetChild.childNodes[n].className).split(' ')[1];

      (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
        WidgetConfig(dataType, name) : null;
    }
    let average = (dataType === 'gridOne') ? 12 : (dataType === 'gridTwo' ? 6 : 4);
    let gridData = this.initGridConfig(targetChild.childNodes[0], average);
    let gridConfig = {
      node: targetChild.childNodes[0],
      configRow: gridData.configRow,
      configColumn: gridData.configColumn
    };

    this.props.getRowConfig(gridConfig);
  }

  proxyblur(e) {
    let data = this.props.reportData;
    let name = e.target.name;
    let childNodes = e.target.offsetParent.nextSibling.childNodes;

    if (name === 'titleContent') {
      for (let i = 0; i < childNodes.length; i++) {
        childNodes[i].className === 'chartTitle' ?
        childNodes[i].childNodes[0].innerHTML = e.target.value : null;
      }
      this.chartProperty(data, e);
    }
    else if (name === 'orthoAxisTitle' || name === 'height') {
      this.chartProperty(data, e);
    }
    else if (name === 'paramName') {
      let chartParameter = e.target.value;
      let exist = false;

      this.chartParameters.map(d=>{
        d === chartParameter ? exist = true : null;
      });
      if (!exist && chartParameter) {
        let li = '<li><span><input type="checkbox" /></span><span>变量名</span><span>默认值</span></li>';

        this.chartParameters.push(chartParameter);
        this.componentsParameter(e, data);
        this.chartParameters.map(d=>{
          li += '<li><span><input type="checkbox" class="checkQueryParam"/></span><span>' +
          chartParameter + '</span><input type="text"/></li>';
        });
        document.querySelector('ul.queryParamList').innerHTML = li;
      }
    }
  }

  componentsParameter(e, data) {
    let parameter = {
      id: e.target.value,
      type: 'ComponentsParameter',
      typeDesc: 'Simple parameter',
      parent: 'UnIqEiD',
      properties: []
    };

    parameter.properties.push({
      name: 'propertyValue',
      value: ''
    });
    parameter.properties.push({name: 'name', value: e.target.value});
    data.push(parameter);
    // console.log(data);
    this.props.saveData(data);
  }

  dropCharts(ev) {
    let childNodeList = [];
    let dataType = ev.dataTransfer.getData('Text');

    $(ev.target).html(this.layoutDom('gridChart'));
    let targetChild = ev.target.childNodes[ev.target.childNodes.length - 1];

    for (let n = 0; n < targetChild.childNodes.length; n++) {
      let name = (targetChild.childNodes[n].className).split(' ')[1];

      (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
        WidgetConfig(dataType, name) : null;
    };
    let obj = {
      option: dataType,
      node: targetChild.childNodes
    };

    let chartData = ChartComponent(obj);
    let chartObj = {
      chartData: chartData.configData,
      dataType: dataType,
      canvas: chartData.configData.canvas,
      dataTitle: chartData.dataTitle
    };

    this.props.getChartConfig(chartObj);
    ev.target.className === 'widgetPreview' ?
      null : childNodeList = ev.target.parentNode.childNodes;
    for (let l = 0;l < childNodeList.length;l++) {
      childNodeList[l].style.minHeight =
        ev.target.offsetHeight + 'px';
    }
    ev.target.parentNode.style.minHeight =
      ev.target.offsetHeight + 'px';
    $('.' + ev.target.className.split(' ')[1] + ' .iconType').addClass(dataType.split('Chart')[0]);
  }

  // templates of grid layout
  layoutDom(type = 'gridOne') {
    let randomNum = new Date().getTime();
    let domType = {
      gridOne() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer container_' + randomNum + '">' +
              '<div class = "columnOne columnOne_' + randomNum + '"></div>' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "widgetAction">' +
            '<span class="configAction"><i class="config" title="config"></i>' +
              '<i class="move" title="move"></i>' +
              '<i title="delete" class="delete"></i><i class="export" title="export"></i></span>' +
            '</div>' +
          '</div>'
        );
      },
      gridTwo() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer container_' + randomNum + '">' +
              '<div class = "columnTwo columnT_' + randomNum + '"></div>' +
              '<div class = "columnTwo columnTwo_' + randomNum + '"></div>' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "widgetAction">' +
            '<span class="configAction"><i class="config" title="config"></i>' +
              '<i class="move" title="move"></i>' +
              '<i title="delete" class="delete"></i><i class="export" title="export"></i></span>' +
            '</div>' +
          '</div>'
        );
      },
      gridThree() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer container_' + randomNum + '">' +
              '<div class = "columnThree columnTh_' + randomNum + '"></div>' +
              '<div class = "columnThree columnThr_' + randomNum + '"></div>' +
              '<div class = "columnThree columnThree_' + randomNum + '"></div>' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "widgetAction">' +
              '<span class="configAction"><i class="config" title="config"></i>' +
              '<i class="move" title="move"></i>' +
              '<i title="delete" class="delete"></i><i class="export" title="export"></i></span>' +
            '</div>' +
          '</div>'
        );
      },
      gridChart() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer container_' + randomNum + '">' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "chartAction">' +
              '<span class = "chartTitle"><i class="iconType">chartName</i></span>' +
              '<span class="configAction"><i class="config" title="config"></i>' +
              '<i class="move" title="move"></i>' +
              '<i title="delete" class="delete"></i><i class="export" title="export"></i></span>' +
            '</div>' +
          '</div>'
        );
      }
    };

    return domType[type] ? domType[type]() : domType['gridOne']();
  }

  // init rows and column layout parameter
  initGridConfig(node, num) {
    let configColumn = [];
    let configRow = [
      {
        'name': 'name',
        'value': node.className
      },
      {
        'name': 'height',
        'value': ''
      }
    ];

    for (let i = 0; i < node.childNodes.length; i++) {
      let column = [
        {
          'name': 'name',
          'value': node.childNodes[i].className
        },
        {
          'name': 'bootstrapSmall',
          'value': num
        },
        {
          'name': 'height',
          'value': ''
        }
      ];

      configColumn.push(column);
    };

    let data = {
      configRow: configRow,
      configColumn: configColumn
    };

    return data;
  }

  // show widgetConfig and dataSourceNames
  setWidgetConfig(nodeName) {
    $('.widgetConfig').addClass('hide');
    $('.' + nodeName).removeClass('hide');
    $('.dataSourceConfig').addClass('hide');
    $('.propertyConfig').removeClass('hide');
    let html = '<option>选择查询</option>';

    this.dataSourceNames.map(d=>{
      html += '<option>' + d + '</option>';
    });
    html += '<option>创建新查询</option>';
    $('.dataSource select.data').html(html);
  }

  borderColor(nodeName, offsetParent) {
    let container = 'container_' + nodeName.split('_')[1];
    let column = $('.' + container)[0].childNodes;

    $('.columnOne, .columnTwo, .columnThree').css({
      borderColor: '#B7B7B7'
    });
    if (offsetParent.className === 'widgetAction') {
      for (let i = 0; i < column.length; i++) {
        column[i].style.borderColor = '#7ABAEF';
      };
    }
    else if (offsetParent.className === 'chartAction') {
      let nodeColumn = offsetParent.offsetParent.parentNode;

      nodeColumn.style.borderColor = '#7ABAEF';
    }
  }

  proxyClick(ev) {
    let data = this.props.reportData;
    let name = ev.target.className;

    if (name === 'config') {
      let offsetParent = ev.target.offsetParent;
      let node = offsetParent.previousSibling;
      let nodeName = node.className.split(' ')[1];

      this.setWidgetConfig(nodeName);
      this.borderColor(nodeName, offsetParent);
    }
    else if (name === 'widgetPreview' || name === 'closeIcon') {
      $('.widgetConfig').addClass('hide');
    }
    else if (name === 'gridConfirm') {
      this.GridProportion(ev, data);
      this.props.saveData(data);
    }
    else if (ev.target.type === 'radio') {
      let container = 'container_' + ev.target.offsetParent.className.split('_')[1];
      let widget = document.querySelector('.' + container).parentNode.childNodes[2];

      ev.target.name === 'titleLoc' ? widget.style.textAlign = ev.target.value : null;
      ev.target.name === 'export' ? $('.' + widget.className + '　i.export').hide() : null;
      this.chartProperty(data, ev);
    }
    else if (name.indexOf('column') > -1) {
      let config = 'config_' + name.split('_')[1];
      let kids = ev.target.parentNode.childNodes;

      $('.columnOne, .columnTwo, .columnThree').css({
        borderColor: '#B7B7B7'
      });
      for (let i = 0; i < kids.length; i++) {
        let column = kids[i].className.split(' ')[1];

        $('.' + column).css({
          borderColor: '#7ABAEF'
        });
      }
      $('.widgetConfig').addClass('hide');
      $('.' + config).removeClass('hide');
    }
    else if (name === 'delete') {
      let widget = ev.target.offsetParent.offsetParent;
      let parent = widget.parentNode;

      this.deleteChart(data, widget);
      parent.removeChild(widget);
      this.props.saveData(data);
    }
    else if (name === 'saveDataSource') {
      let widgetConfig = ev.target.offsetParent.className;
      let config = widgetConfig.split(' ')[1];
      let sourceName = $('.' + config + ' .sourceName')[0].value;

      $('.' + config + ' .dataSourceConfig').addClass('hide');
      $('.' + config + ' .propertyConfig').removeClass('hide');
      sourceName ? this.dataSource(data, widgetConfig) : console.log('fill out name.');
    }
    else if (name === 'checkParam') {
      let container = 'widgetContainer container_' + ev.target.offsetParent.className.split('_')[1];
      let paramValue = ev.target.parentNode.nextSibling.value;

      data.map(d=>{
        (d.canvas && d.canvas.className === container) ? d.components.properties.map(t=>{
          t.name === 'listeners' ? t.value.push('${p:' + paramValue + '}') : null;
        }) : null;
      });
    }
    else if (name === 'paramListen') {
      let container = 'widgetContainer container_' + ev.target.offsetParent.className.split('_')[1];
      let paramValue = ev.target.parentNode.nextSibling.value;
      let paramString = '\\' + paramValue + '\\, \\' + paramValue + '\\';

      data.map(d=>{
        (d.canvas && d.canvas.className === container) ? d.components.properties.map(t=>{
          t.name === 'parameters' ? t.value.push(paramString) : null;
        }) : null;
      });
    }
  }

  deleteChart(data, widget) {
    let id = null;
    let index = [];
    let chartId = [];

    for (let i = 0; i < widget.childNodes.length; i++) {
      let widgetName = widget.childNodes[i].className;

      (widgetName.indexOf('container_') > -1) ? id = widgetName : null;
    }
    data.map((d, i)=>{
      if (d.id === id) {
        index.push(i);
      }
      else if (d.parent === id) {
        index.push(i);
        chartId.push(d.id);
      }
      else if (d.canvas) {
        d.canvas.className === id ? index.push(i) : null;
      }
    });
    for (let j = index.length - 1; j > -1; j--) {
      data.splice(index[j], 1);
    };
    for (let j = chartId.length - 1; j > -1; j--) {
      data.map((m, n)=>{
        m.canvas ? m.components.properties.map(f=>{
          f.value === chartId[j] ? data.splice(n, 1) : null;
        }) : null;
      });
    };
    $('.columnOne, .columnTwo, .columnThree').css({
      borderColor: '#B7B7B7'
    });
  }

  // set grids width and rerender widgets
  GridProportion(ev, data) {
    let parentName = ev.target.offsetParent.className,
      containerName = 'container_' + parentName.split('_')[1],
      configName = parentName.split(' ')[1],
      gridTotally = 0,
      nodes = $('.' + configName + ' .column input[type="text"]');

    for (let j = 0; j < nodes.length; j++) {
      let num = parseInt(nodes[j].value, 10);
      let name = $('.' + containerName)[0].childNodes[j].className;

      gridTotally += num;
      data.map(d=>{
        d.id === name ? d.properties.map(p=>{
          p.name === 'bootstrapSmall' ? p.value = num : null;
        }) : null;
      });
    }
    if (gridTotally === 12) {
      for (let i = 0; i < nodes.length; i++) {
        let value = nodes[i].value,
          chartProperty = {},
          node = $('.' + containerName)[0].childNodes[i],
          canvas = node.childNodes[0] ?
          node.childNodes[0].childNodes[0].className : null;

        node.style.width = (value / 12 * 100) + '%';
        let cntWidth = $('.' + containerName)[0].clientWidth;

        data.map((d, i)=>{
          if (d.canvas && d.canvas.className === canvas) {
            d.components.properties.map(t=>{
              t.name === 'width' ? t.value = value / 12 * cntWidth - 10 : null;
              chartProperty[t.name] = (t.value === 'false' || t.value === 'true') ?
                JSON.parse(t.value) : t.value;
            });
            let obj = {
              option: d.type,
              node: [d.canvas],
              chartData: chartProperty
            };

            ChartComponent(obj);
          }
        });
        this.props.saveData(data);
      }
    }
  }
  // save chart data source
  dataSource(data, widgetConfig) {
    let config = widgetConfig.split(' ')[1],
      random = config.split('_')[1],
      source = {
        id: widgetConfig,
        type: 'Componentsmdx_mondrianJndi',
        typeDesc: 'mondrianJndi',
        parent: 'UnIqEiD',
        properties: [],
        meta: 'CDA',
        meta_conntype: 'mondrian.jndi',
        meta_datype: 'mdx'
      },
      sourceName = $('.' + config + ' .sourceName')[0].value,
      jndi = $('.' + config + ' .sourceConnect')[0].value,
      cubes = $('.' + config + ' .dataCubes')[0].value,
      query = $('.' + config + ' .sqlStatement')[0].value,
      queryType = $('.' + config + ' .queryType')[0].value,
      stringCubes = 'mondrian:/',
      catalog = (queryType === 'mdx') ? stringCubes + cubes : cubes;
    let dataRows = {
      name: sourceName,
      jndi: jndi,
      access: 'pubilc',
      catalog: catalog,
      query: query,
      bandedMode: 'compact',
      parameters: [],
      cdacalculatedcolumns: [],
      cdacolumns: [],
      output: [],
      outputMode: 'include',
      cacheKeys: [],
      cacheDuration: 3600,
      cache: true
    };

    d3.entries(dataRows).map(d=>{
      let row = {
        'name': d.key,
        'value': d.value
      };

      source.properties.push(row);
    });
    data.push(source);
    this.chartDataSource(data, sourceName, random);
    this.dataSourceNames.push(sourceName);
    this.selectDataSource(data, sourceName, random);
    return source;
  }

  // show exist dataSource in select tag and add options change function.
  selectDataSource(data, sourceName, random) {
    let html = '<option class="existDataSource">' + sourceName + '</option>';

    $('select.data').append(html);
    $('select.data').on('change', (e)=>{
      let data = this.props.reportData,
        name = $(e.target)[0][$(e.target)[0].selectedIndex].value,
        widgetConfig = $(e.target)[0].offsetParent.className,
        random = widgetConfig.split('_')[1];

      $(e.target)[0].selectedIndex > 1 ? this.chartDataSource(data, name, random) : null;
    });
  }

  // modify chart dataSource property
  chartDataSource(data, name, random) {
    data.map(d=>{
      if (d.canvas) {
        let number = d.canvas.className.split('_')[1];

        if (number === random) {
          let properties = d.components.properties;

          for (let i = 0; i < properties.length; i++) {
            properties[i].name === 'dataSource' ? properties[i].value = name : null;
          }
        }
      }
    });
    this.props.saveData(data);
  }

  // modify chart properties,data is the chart properties
  chartProperty(data, ev) {
    let reportComponents = null;
    let getProperty = [];
    let value = ev.target.value;
    let name = ev.target.name;
    let className = ev.target.className;

    if (className === 'gridLine') {
      let configName = ev.target.offsetParent.previousSibling.className;

      this.chartLegendPosition(configName, getProperty, value);
    }
    else if (name === 'dataFormat') {
      getProperty = (className === 'crosstabMode' ?
        [{name: 'seriesInRows', value: false}, {name: 'crosstabMode', value: true}] :
        [{name: 'seriesInRows', value: true}, {name: 'crosstabMode', value: false}]);
    }
    else {
      let param = (name === 'titleContent' ? {name: 'name', value: value} :
        {name: name, value: value});

      getProperty.push(param);
    }
    data.map(d=>{
      d.canvas ? (d.canvas.className === ev.target.offsetParent.previousSibling.className ?
        reportComponents = d : null) : null;
    });
    for (let x = 0; x < getProperty.length; x++) {
      reportComponents.components.properties.map(i=>{
        if (i.name === getProperty[x].name) {
          i.value = getProperty[x].value;
          reportComponents.chartData[getProperty[x].name] =
          (value === 'false' || value === 'true') ?
          JSON.parse(getProperty[x].value) : getProperty[x].value;
        }
      });
    }
    this.props.saveData(data);
    let obj = {
      option: reportComponents.type,
      node: [reportComponents.canvas],
      chartData: reportComponents.chartData
    };

    ChartComponent(obj);
  }

  chartLegendPosition(configName, getProperty, value) {
    let config = 'config_' + configName.split('_')[1];
    let nodes = document.querySelectorAll('.' + config + ' input.location');

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].checked && nodes[i].defaultValue === value) {
        getProperty.push({name: 'orthoAxisGrid', value: true});
        getProperty.push({name: 'baseAxisGrid', value: false});
      }
      else if (value === 'true') {
        getProperty.push({name: 'orthoAxisGrid', value: true});
        getProperty.push({name: 'baseAxisGrid', value: true});
      }
      else if (value === 'false') {
        getProperty.push({name: 'orthoAxisGrid', value: false});
        getProperty.push({name: 'baseAxisGrid', value: false});
      }
      else {
        getProperty.push({name: 'orthoAxisGrid', value: false});
        getProperty.push({name: 'baseAxisGrid', value: true});
      }
    }
  }

  render() {
    return (
      <div className = "widgetPreview"
        onClick = {this.proxyClick}
        onDrop={this.drop}
        onDragOver={this.allowDrop} />
    );
  }
}

export default WidgetPreview;
