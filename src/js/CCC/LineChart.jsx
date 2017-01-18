/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

export default function line(option) {
  let configData = null;
  let relational_01 = {
    resultset: [
      ['London', '2011-06-05', 72],
      ['London', '2011-06-12', 50],
      ['London', '2011-06-19', 20],
      ['London', '2011-06-26', 23],
      ['London', '2011-07-03', 72],
      ['London', '2011-07-10', 80],
      ['London', '2011-07-26', 23],
      ['London', '2011-07-31', 72],
      ['London', '2011-08-07', 50],
      ['London', '2011-08-14', 20],
      ['London', '2011-08-28', 20],
      ['Paris', '2011-06-05', 27],
      ['Paris', '2011-06-26', 32],
      ['Paris', '2011-07-03', 24],
      ['Paris', '2011-07-10', 80],
      ['Paris', '2011-07-17', 90],
      ['Paris', '2011-07-24', 53],
      ['Paris', '2011-07-31', 17],
      ['Paris', '2011-08-07', 20],
      ['Paris', '2011-08-21', 43],
      ['Lisbon', '2011-06-12', 30],
      ['Lisbon', '2011-07-03', 60],
      ['Lisbon', '2011-07-10', 80],
      ['Lisbon', '2011-07-17', 15]
    ],
    metadata: [{
      'colIndex': 0,
      'colType': 'String',
      'colName': 'City'
    }, {
      'colIndex': 1,
      'colType': 'String',
      'colName': 'Date'
    }, {
      'colIndex': 2,
      'colType': 'Numeric',
      'colName': 'Quantity'
    }]
  };
  let htmlObject = option.node[0].parentNode.parentNode.className;

  option.chartData ? configData = option.chartData : configData = {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 1,
    height: 350,
    orthoAxisTitle: '',
    orientation: 'vertical',
    orthoAxisGrid: true,
    baseAxisGrid: false,
    timeSeries: true,
    barOrthoSizeMin: '',
    nullInterpolationMode: 'none',
    // colors: ['#005CA7'],
    line_interpolate: 'linear',
    dotsVisible: false,
    areasVisible: false,
    hoverable: false,
    valuesVisible: false,
    animate: false,
    legend: true,
    legendPosition: 'left',
    stacked: false,
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
    name: 'lineChart'
  };

  new pvc.LineChart(configData)
  .setData(relational_01)
  .render();
  let dataTitle = {
    id: '',
    type: 'ComponentscccLineChart',
    typeDesc: 'CCC Line Chart',
    parent: 'UnIqEiD'
  };
  let chartConfig = {
    configData: configData,
    dataSource: relational_01,
    dataTitle: dataTitle
  };

  return chartConfig;
}
