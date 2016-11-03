/**
 * Created by Fine on 2016/8/25.
 */

import React from 'react';
import autoBind from 'react-autobind';
// import $ from 'jquery';

import WidgetPreview from './WidgetPreview';
import { test } from '../public/test';
import { components } from '../public/barData';
import { rowData } from '../public/rowData';
import { columnData } from '../public/columnData';
import '../../style/Components/WidgetMain';

class WidgetMain extends React.Component {
  constructor(props) {
    super(props);
    this.reportData = [];
    this.reportChart = [];
    this.columnArr = [];
    autoBind(this, 'getChartConfig', 'saveData', 'saveReport', 'getRowConfig',
      'getColumnConfig', 'layoutData');
  }

  getChartConfig(data) {
    components.rows.map(d=>{
      d.properties.map(t=>{
        data.chartData[t.name] ? t.value = data.chartData[t.name] : null;
        t.name === 'htmlObject' ? t.value = data.canvas.parentNode.parentNode.className : null;
      });
    });
    let chartComponents = {
      chartType: data.dataType,
      canvas: data.canvas.className,
      chartData: data.chartData,
      components: components
    };

    this.reportData.push(chartComponents);
    // console.log(this.reportData);
  }

  getRowConfig(data) {
    rowData.properties.map(d=>{
      d.name === 'name' ? d.value = data.node.className : null;
    });
    let rowObj = {
      type: data.type,
      name: data.node.className,
      rowData: rowData
    };

    this.reportData.push(rowObj);
    this.getColumnConfig(data);
  }

  getColumnConfig(data) {
    for (let i = 0; i < data.node.childNodes.length; i++) {
      let columnObj = {
        type: data.type,
        name: data.node.childNodes[i].className,
        columnData: columnData
      };

      this.reportData.push(columnObj);
    };
  }

  saveData(data) {
    Array.isArray(data) ? this.reportChart = data : this.reportChart = this.reportData;
  }

  layoutData() {

  }

  saveReport(ev) {
    console.log(this.reportChart);

    // let data = new FormData(document.querySelector('.formHidden'));

    // $.ajax({
    //   type: 'post',
    //   headers: {'Content-Type': undefined},
    //   url: '/xdatainsight/plugin/pentaho-cdf-dd/api/syncronizer/saveDashboard',
    //   data: data,
    //   processData: false,
    //   contentType: 'multipart/form-data',
    //   cache: false,
    //   success(msg) {
    //     console.log(msg);
    //   }
    // });
  }

  render() {
    // let randomNum = new Date().getTime();
    let file = '/home/1111.wcdf';
    let operation = 'saveas';

    return (
      <div className = "widgetMain">
        <WidgetPreview getChartConfig = {this.getChartConfig} reportChart = {this.reportChart}
          reportData = {this.reportData} saveData = {this.saveData}
          getRowConfig = {this.getRowConfig}/>
        <div className = "footer">
          <form className = "formHidden">
            <input type="hidden" name="file" value = {file}/>
            <input type="hidden" name="operation" value = {operation}/>
            <input type="hidden" name="cdfstructure" value = {JSON.stringify(test, '', 1)}/>
          </form>
          <input type = "button" value = "另存为" onClick = {this.saveReport}/>
          <input type = "button" value = "保存" onClick = {this.saveReport}/>
        </div>
      </div>
    );
  }
}

export default WidgetMain;
