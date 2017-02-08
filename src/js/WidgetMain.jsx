/**
 * Created by Fine on 2016/8/25.
 */

import React from 'react';
import autoBind from 'react-autobind';
import d3 from './public/d3';
// import $ from 'jquery';
import 'whatwg-fetch';

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
        'name': d.key,
        'value': d.value
      };

      configArr.push(chart);
    });
    let row = {
      'id': data.canvas.className,
      'type': data.dataTitle.type,
      'typeDesc': data.dataType.typeDesc,
      'parent': data.dataTitle.parent,
      'properties': configArr,
      'meta_cdwSupport': data.dataTitle.meta_cdwSupport
    };
    let chartComponents = {
      'type': data.dataType,
      'canvas': data.canvas,
      'chartData': data.chartData,
      'components': row
    };

    this.reportData.push(chartComponents);
  }

  dataSourcesConfig() {

  }
  // process rows data
  getRowConfig(data) {
    let rowObj = {
      'type': 'LayoutRow',
      'typeDesc': '行',
      'parent': 'UnIqEiD',
      'id': data.node.className,
      'properties': data.configRow
    };

    this.reportData.push(rowObj);
    this.getColumnConfig(data);
  }

  // process column data
  getColumnConfig(data) {
    for (let i = 0; i < data.configColumn.length; i++) {
      let columnObj = {
        'id': data.node.childNodes[i].className,
        'parent': data.node.className,
        'type': 'LayoutBootstrapColumn',
        'typeDesc': '列',
        'properties': data.configColumn[i]
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
        'layout': {},
        'components': {},
        'datasources': {},
        'filename': '/home/fineTest1.wcdf'
      },
      dataList = [],
      componentsRows = [],
      layoutRows = [],
      dataSourcesRows = [],
      widgetsData = (this.reportChart === null ? this.reportData : this.reportChart);

    widgetsData.map(d=>{
      let child = {};

      if (d.canvas) {
        child.type = d.type;
        child.canvas = d.canvas;
        child.chartData = d.chartData;
        child.components = {
          id: d.components.id.split(' ')[1],
          meta_cdwSupport: true,
          parent: d.components.parent,
          type: d.components.type,
          typeDesc: d.components.typeDesc,
          properties: []
        };
        d.components.properties.map(i=>{
          i.name === 'canvas' ? i.value = '' : null;
          let k = {
            name: i.name,
            value: i.name === 'htmlObject' ? '${h:' + i.value.split(' ')[1] + '}' : i.value
          };

          child.components.properties.push(k);
        });
      }
      else if (d.meta) {
        child.id = d.id.split(' ')[1];
        child.meta = d.meta;
        child.type = d.type;
        child.meta_conntype = d.meta_conntype;
        child.meta_datype = d.meta_datype;
        child.parent = (d.parent !== 'UnIqEiD') ? d.parent.split(' ')[1] : 'UnIqEiD';
        child.properties = [];
        d.properties.map(i=>{
          let k = {
            name: i.name,
            value: i.value
          };

          child.properties.push(k);
        });
      }
      else {
        child.id = d.id.split(' ')[1];
        child.type = d.type;
        child.typeDesc = d.typeDesc;
        child.parent = (d.parent !== 'UnIqEiD') ? d.parent.split(' ')[1] : 'UnIqEiD';
        child.properties = [];
        d.properties.map(i=>{
          let k = {
            name: i.name,
            value: i.name === 'name' ? i.value.split(' ')[1] : i.value
          };

          child.properties.push(k);
        });
      }
      dataList.push(child);
    });
    dataList.map(d=>{
      if (d.type.indexOf('Chart') > -1) {
        d.components.properties.map(t=>{
          (t.name === 'canvas' || t.name === 'width') ? t.value = '' : null;
        });
        componentsRows.push(d.components);
      };
      (d.type.indexOf('Layout') > -1) ? layoutRows.push(d) : null;
      (d.type.indexOf('Jndi') > -1) ? dataSourcesRows.push(d) : null;
    });
    report.layout = {
      'title': 'CDF - Sample structure',
      'rows': layoutRows
    };
    report.components = {
      'rows': componentsRows
    };
    report.datasources = {
      'rows': dataSourcesRows
    };
    console.log(report);
    return report;
  }

  // save and commit layout data by form
  saveReport(ev) {
    let file = '/home/fineTest1.wcdf';
    let stringData = JSON.stringify(this.layoutData(), '', 1);

    $('.formHidden input[name="cdfstructure"]').attr('value', stringData);
    $('.formHidden input[name="operation"]').attr('value', 'saveas');
    $('.formHidden input[name="file"]').attr('value', file);
    let data = new FormData(document.querySelector('.formHidden'));

    fetch('/xdatainsight/plugin/pentaho-cdf-dd/api/syncronizer/saveNewDashboard', {
      method: 'POST',
      body: data,
      credentials: 'same-origin'
    })
    .then(res => console.log('Response succeeded?', JSON.stringify(res.ok)))
    .catch(e => console.log(e));
  }

  render() {
    return (
      <div className = "widgetMain">
        <div className="mainAction hidden">
          <span>
            <i className = "preLayout" />
            <i className = "saveas" />
            <i className = "apply" />
            <i className = "variables" />
            <i className = "query" />
          </span>
        </div>
        <WidgetPreview getChartConfig = {this.getChartConfig} reportChart = {this.reportChart}
          reportData = {this.reportData} saveData = {this.saveData}
          getRowConfig = {this.getRowConfig}/>
        <div className = "footer">
          <form className = "formHidden">
            <input type="hidden" name="file"/>
            <input type="hidden" name="operation"/>
            <input type="hidden" name="cdfstructure"/>
          </form>
          <input type = "button" name="saveas" value = "另存为" onClick = {this.saveReport}/>
          <input type = "button" name="save" value = "保存" onClick = {this.saveReport}/>
        </div>
      </div>
    );
  }
}

export default WidgetMain;
