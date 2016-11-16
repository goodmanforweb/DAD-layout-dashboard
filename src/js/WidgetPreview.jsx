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
    autoBind(this, 'drop', 'setConfig', 'chartProperty',
      'dataSource', 'initGridConfig', 'chartDataSource');
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  // drop components in widgetPreview
  drop(ev) {
    ev.preventDefault();
    let target = $(ev.target);
    let dataType = ev.dataTransfer.getData('Text');
    let options = {
      type: dataType,
      node: ev.target
    };

    if (dataType.indexOf('Chart') > -1) {
      let childNodeList = [];

      target.html(this.layoutDom('gridOne'));
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      for (let n = 0; n < targetChild.childNodes.length; n++) {
        let name = (targetChild.childNodes[n].className).split(' ')[1];

        (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
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
      target[0].className === 'widgetPreview' ?
        null : childNodeList = target[0].parentNode.childNodes;
      for (let l = 0;l < childNodeList.length;l++) {
        childNodeList[l].style.minHeight =
          $(ev.target)[0].offsetHeight + 'px';
      }
      $(ev.target)[0].parentNode.style.minHeight =
        $(ev.target)[0].offsetHeight + 'px';
    }
    else if (dataType.indexOf('grid') > -1) {
      target.append(this.layoutDom(dataType));
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      for (let n = 0; n < targetChild.childNodes.length; n++) {
        let name = (targetChild.childNodes[n].className).split(' ')[1];

        (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
      let gridData = this.initGridConfig(targetChild.childNodes[0]);
      let gridConfig = {
        node: targetChild.childNodes[0],
        configRow: gridData.configRow,
        configColumn: gridData.configColumn
      };

      this.props.getRowConfig(gridConfig);
    }
    else if (dataType === 'olapPlugin') {
      switchOlapChart();
    }
    else {
      // let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      // for (let n = 0; n < targetChild.childNodes.length; n++) {
      //   let name = (targetChild.childNodes[n].className).split(' ')[1];

      //   (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
      //     WidgetConfig(dataType, name) : null;
      // }
      widgetComponent(options);
    }
    $('.widgetConfig').css({
      zIndex: 0
    });
    $('.widgetConfig').addClass('hide');
    let name = (target[0].childNodes[0].childNodes[1].className).split(' ')[1];

    $('.' + name).removeClass('hide');
    $('.' + name).css({
      zIndex: 100
    });
    $('.widgetPreview').css({
      background: 'none'
    });
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
            '<div class = "widgetAction"></div>' +
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
            '<div class = "widgetAction"></div>' +
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
            '<div class = "widgetAction"></div>' +
          '</div>'
        );
      }
    };

    return domType[type] ? domType[type]() : domType['gridOne']();
  }

  // init rows and column layout parameter
  initGridConfig(node) {
    let configColumn = [];
    let configRow = [
      {
        name: 'name',
        value: node.className
      },
      {
        name: 'height',
        value: ''
      }
    ];

    for (let i = 0; i < node.childNodes.length; i++) {
      let column = [
        {
          name: 'name',
          value: node.childNodes[i].className
        },
        {
          name: 'bootstrapSmall',
          value: ''
        },
        {
          name: 'height',
          value: ''
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
  // operate widgetconfig setting about show, chart properties and data source.
  setConfig(ev) {
    let data = this.props.reportData;
    let node = $(ev.target)[0].previousSibling;
    let name = $(ev.target)[0].className;

    if (name === 'widgetAction') {
      $('.widgetConfig').addClass('hide');
      $(node).removeClass('hide');
      node.style.zIndex = 100;
    }
    else if ($(ev.target)[0].localName === 'input' && $(ev.target)[0].type === 'radio') {
      this.chartProperty(data, ev);
    }
    else if (name === 'data' && $(ev.target)[0].localName === 'select') {
      // console.log($(ev.target));
    }
    else if (name === 'saveDataSource') {
      let widgetConfig = $(ev.target)[0].offsetParent.className;
      let config = widgetConfig.split(' ')[1];
      let sourceName = $('.' + config + ' .sourceName')[0].value;

      $('.' + config + ' .dataSourceConfig').addClass('hide');
      $('.' + config + ' .propertyConfig').removeClass('hide');
      sourceName ? this.dataSource(data, widgetConfig) : console.log('fill out name.');
    }
  }

  // save chart data source
  dataSource(data, widgetConfig) {
    let config = widgetConfig.split(' ')[1],
      random = config.split('_')[1],
      source = {
        id: widgetConfig,
        type: 'Componentsmdx_mondrianJndi',
        typeDesc: '',
        parent: 'UnIqEiD',
        properties: [],
        meta: 'CDA',
        meta_conntype: 'mondrian.jndi',
        meta_datype: 'mdx'
      },
      sourceName = $('.' + config + ' .sourceName')[0].value,
      jndi = $('.' + config + ' .sourceConnect')[0].value,
      cubes = $('.' + config + ' .dataCubes')[0].value,
      dataRows = {
        name: sourceName,
        jndi: jndi,
        access: 'pubilc',
        catalog: cubes,
        query: '',
        parameters: [],
        cdacalculatedcolumns: [],
        cdacolumns: [],
        output: [],
        outputMode: [],
        cacheKeys: [],
        cacheDuration: [],
        cache: true
      };

    d3.entries(dataRows).map(d=>{
      let row = {
        name: d.key,
        value: d.value
      };

      source.properties.push(row);
    });
    data.push(source);
    this.chartDataSource(data, sourceName, random);
    this.props.saveData(this.chartDataSource);
    return source;
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
          console.log(properties);
        }
      }
    });
    return data;
  }

  // modify chart properties,data is the chart properties
  chartProperty(data, ev) {
    let reportComponents = null;

    data.map(d=>{
      d.canvas ? (d.canvas.className ===
        $($(ev.target)[0].offsetParent)[0].previousSibling.className ?
        reportComponents = d : null) : null;
    });
    reportComponents.components.properties.map(i=>{
      if (i.name === $(ev.target)[0].name) {
        i.value = $(ev.target)[0].value;
        ($(ev.target)[0].value === 'false' || $(ev.target)[0].value === 'true') ?
        reportComponents.chartData[$(ev.target)[0].name] =
          JSON.parse($(ev.target)[0].value) :
        reportComponents.chartData[$(ev.target)[0].name] = $(ev.target)[0].value;
      }
    });
    this.props.saveData(data);
    let obj = {
      option: reportComponents.type,
      node: [reportComponents.canvas],
      chartData: reportComponents.chartData
    };

    ChartComponent(obj);
  }

  render() {
    return (
      <div className = "widgetPreview"
        onClick = {this.setConfig}
        onDrop={this.drop}
        onDragOver={this.allowDrop} />
    );
  }
}

export default WidgetPreview;
