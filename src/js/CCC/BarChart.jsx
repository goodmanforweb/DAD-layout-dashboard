/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

export default function bar(option) {
  let configData = null;
  let relational = {
    'resultset': [
      ['London', 74],
      ['Paris', 48],
      ['New York', 37],
      ['Prague', 27],
      ['Stockholm', 22],
      ['Sydney', 19],
      ['Madrid', 18],
      ['Lisbon', 41],
      ['Pequim', 7],
      ['Rome', 48],
      ['Athens', 27],
      ['Luanda', 76],
      ['Ottawa', 21],
      ['Berlin', 30],
      ['Brasilia', 50],
      ['Beijing', 41]
    ],
    'metadata': [{
      'colIndex': 0,
      'colType': 'String',
      'colName': 'City'
    }, {
      'colIndex': 1,
      'colType': 'Numeric',
      'colName': 'Value'
    }]
  };

  configData = option.chartData ? option.chartData : {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 10,
    height: 350,
    orthoAxisTitle: '',
    orientation: 'vertical',
    orthoAxisGrid: true,
    baseAxisGrid: false,
    crosstabMode: true,
    axisLabel_font: 'normal 10px "Open Sans"',
    colors: ['#005CA7'],
    hoverable: false,
    valuesVisible: false,
    animate: false,
    legend: true,
    legendPosition: 'left',
    stacked: false,
    barOrthoSizeMin: '',
    clickable: false,
    dataSource: '',
    htmlObject: option.node[0].parentNode.parentNode.className,
    executeAtStart: true,
    compatVersion: 2,
    seriesInRows: false,
    clickAction: '',
    listeners: [],
    parameters: [],
    plotFrameVisible: false,
    orthoAxisTicks: false,
    orthoAxisTitleAlign: 'left',
    titleLoc: 'left',
    iconType: 'bar',
    export: true,
    name: 'barChart'
  };
  new pvc.BarChart(configData)
  .setData(relational)
  .render();

  let dataTitle = {
    'type': 'ComponentscccBarChart',
    'typeDesc': 'CCC Bar Chart',
    'parent': 'UnIqEiD',
    'meta_cdwSupport': true
  };
  let chartConfig = {
    configData: configData,
    dataTitle: dataTitle
  };

  return chartConfig;
}
