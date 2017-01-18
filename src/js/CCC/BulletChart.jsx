/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

export default function bullet(option) {
  let configData = null;
  let bullet_NameValueMarker = {
    resultset: [
      ['Europe', 800, 300],
      ['Asia', 100, 500],
      ['Africa', 400, 100],
      ['China', 800, 300],
      ['US', 100, 500],
      ['Japan', 400, 100]
    ],
    metadata: [{
      'colIndex': 0,
      'colType': 'String',
      'colName': 'Description'
    }, {
      'colIndex': 1,
      'colType': 'Numeric',
      'colName': 'Value'
    }, {
      'colIndex': 2,
      'colType': 'Numeric',
      'colName': 'Marker'
    }]
  };
  let htmlObject = option.node[0].parentNode.parentNode.className;

  option.chartData ? configData = option.chartData : configData = {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 1,
    height: 400,
    orthoAxisTitle: '',
    orientation: 'horizontal',
    animate: true,
    hoverable: true,
    valuesVisible: false,
    bulletSize: 25,
    bulletSpacing: 50,
    bulletMargin: 100,
    bulletTitle_textStyle: '#333',
    bulletTitle_font: 'normal 15px "Open Sans"',
    bulletMeasure_fillStyle: '#005CA7',
    bulletRuleLabel_font: 'normal 10px "Open Sans"',
    bulletSubtitle: 'Fixed Sub-title',
    bulletSubtitle_font: 'normal 10px "Open Sans"',
    bulletRanges: [200, 500, 1000],
    orthoAxisGrid: false,
    baseAxisGrid: true,
    tooltip: '',
    clickable: false,
    dataSource: '',
    htmlObject: htmlObject,
    executeAtStart: true,
    compatVersion: 2,
    crosstabMode: true,
    seriesInRows: false,
    clickAction: '',
    listeners: [],
    parameters: [],
    plotFrameVisible: false,
    orthoAxisTicks: false,
    orthoAxisTitleAlign: 'left',
    name: ''
  };
  new pvc.BulletChart(configData)
  .setData(bullet_NameValueMarker)
  .render();
  let dataTitle = {
    id: '',
    type: 'ComponentscccBarChart',
    typeDesc: 'CCC Bar Chart',
    parent: 'UnIqEiD'
  };
  let chartConfig = {
    configData: configData,
    dataSource: bullet_NameValueMarker,
    dataTitle: dataTitle
  };

  return chartConfig;
}
