/**
 * Created by Fine on 2016/8/25.
 */

import React from 'react';
import autoBind from 'react-autobind';
import d3 from './public/d3';
import $ from 'jquery';

import WidgetPreview from './WidgetPreview';
import '../style/Components/WidgetMain';

class WidgetMain extends React.Component {

  // WidgetMain init
  constructor(props) {
    super(props);
    this.reportData = [];
    this.reportChart = null;
    this.columnArr = [];
    autoBind(this, 'getChartConfig', 'saveData', 'saveReport', 'getRowConfig',
      'getColumnConfig', 'layoutData');
  }

  // process charts data
  getChartConfig(data) {
    let configArr = [];

    d3.entries(data.chartData).map(d=>{
      let chart = {
        name: d.key,
        value: d.value
      };

      configArr.push(chart);
    });
    let row = {
      id: data.canvas.className,
      type: data.dataTitle.type,
      typeDesc: data.dataType.typeDesc,
      parent: data.dataTitle.parent,
      properties: configArr,
      meta_cdwSupport: data.dataTitle.meta_cdwSupport
    };
    let chartComponents = {
      type: data.dataType,
      canvas: data.canvas,
      chartData: data.chartData,
      components: row
    };

    this.reportData.push(chartComponents);
  }

  dataSourcesConfig() {

  }
  // process rows data
  getRowConfig(data) {
    let rowObj = {
      type: 'LayoutRow',
      typeDesc: '行',
      parent: 'UnIqEiD',
      id: data.node.className,
      properties: data.configRow
    };

    this.reportData.push(rowObj);
    this.getColumnConfig(data);
  }

  // process column data
  getColumnConfig(data) {
    for (let i = 0; i < data.configColumn.length; i++) {
      let columnObj = {
        id: data.node.childNodes[i].className,
        parent: data.node.className,
        type: 'LayoutBootstrapColumn',
        typeDesc: '列',
        properties: data.configColumn[i]
      };

      this.reportData.push(columnObj);
    };
  }

  // get modified charts properties and data from widgetPreview
  saveData(data) {
    this.reportChart = (Array.isArray(data) ? data : this.reportData);
  }

  // process layout data
  layoutData() {
    let report = {
        layout: {},
        components: {},
        datasources: {},
        filename: 'fine123'
      },
      componentsRows = [],
      layoutRows = [],
      dataSourcesRows = [],
      widgetsData = (this.reportChart === null ? this.reportData : this.reportChart);

    widgetsData.map(d=>{
      (d.type.indexOf('Chart') > -1) ? componentsRows.push(d.components) : null;
      (d.type.indexOf('LayoutRow') > -1) ? layoutRows.push(d) : null;
      (d.type.indexOf('Jndi') > -1) ? dataSourcesRows.push(d) : null;
    });
    report.layout = {
      title: 'CDF - Sample structure',
      rows: layoutRows
    };
    report.components = {
      rows: componentsRows
    };
    report.datasources = {
      rows: dataSourcesRows
    };
    return report;
  }

  // save and commit layout data by form
  saveReport(ev) {
    console.log(JSON.stringify(this.layoutData(), '', 1));
    let file = '/home/fine123.wcdf';
    let data = new FormData(document.querySelector('.formHidden'));

    $('.formHidden input[name="cdfstructure"]').attr('value', JSON.stringify(this.layoutData()));
    $('.formHidden input[name="operation"]').attr('value', $(ev.target)[0].name);
    $('.formHidden input[name="file"]').attr('value', file);
    $.ajax({
      type: 'post',
      url: '/xdatainsight/plugin/pentaho-cdf-dd/api/syncronizer/saveDashboard',
      data: data,
      processData: false,
      contentType: false,
      cache: false,
      success(msg) {
        console.log(msg);
      }
    });
  }

  render() {
    return (
      <div className = "widgetMain">
        <WidgetPreview getChartConfig = {this.getChartConfig} reportChart = {this.reportChart}
          reportData = {this.reportData} saveData = {this.saveData}
          getRowConfig = {this.getRowConfig}/>
        <div className = "footer">
          <form className = "formHidden">
            <input type="hidden" name="file" value=""/>
            <input type="hidden" name="operation" value=""/>
            <input type="hidden" name="cdfstructure" value=""/>
          </form>
          <input type = "button" name="saveas" value = "另存为" onClick = {this.saveReport}/>
          <input type = "button" name="save" value = "保存" onClick = {this.saveReport}/>
        </div>
      </div>
    );
  }
}

export default WidgetMain;
