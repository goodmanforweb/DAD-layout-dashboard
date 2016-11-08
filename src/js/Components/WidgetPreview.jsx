/**
 * Created by Fine on 2016/8/25.
 */

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import $ from 'jquery';

import ChartComponent from './ChartComponent';
import widgetComponent from './WidgetComponent';
import WidgetConfig from './WidgetConfig';
import '../../style/Components/WidgetPreview';
import '../../style/Components/WidgetConfig';

'use strict';

// WidgetPreview object about layout

class WidgetPreview extends Component {

  constructor(props) {
    super(props);
    autoBind(this, 'drop', 'setConfig', 'chartProperty', 'dataSource', 'initGridConfig');
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
    else {
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      for (let n = 0; n < targetChild.childNodes.length; n++) {
        let name = (targetChild.childNodes[n].className).split(' ')[1];

        (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
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
  // widgetconfig show or not
  setConfig(ev) {
    let data = this.props.reportData;
    let node = $(ev.target)[0].previousSibling;

    if ($(ev.target)[0].className === 'widgetAction') {
      $('.widgetConfig').addClass('hide');
      $(node).removeClass('hide');
      node.style.zIndex = 100;
    }
    else if ($(ev.target)[0].localName === 'input' && $(ev.target)[0].type === 'radio') {
      this.chartProperty(data, ev);
    }
  }

  // modify chart data source
  dataSource() {
    // console.log('enter');
  }

  // modify chart properties,data is the chart property
  chartProperty(data, ev) {
    let reportComponents = null;

    data.map(d=>{
      d.canvas === $($(ev.target)[0].offsetParent)[0].previousSibling.className ?
        reportComponents = d : null;
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
