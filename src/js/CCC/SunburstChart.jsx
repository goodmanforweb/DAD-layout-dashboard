/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

export default function sunburst(option) {
  let configData = null;
  let testSunburstThreeLevel = {
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
  let htmlObject = option.node[0].parentNode.parentNode.className;

  option.chartData ? configData = option.chartData : configData = {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 1,
    height: 350,
    orientation: 'vertical',
    orthoAxisGrid: true,
    baseAxisGrid: false,
    crosstabMode: true,
    axisLabel_font: 'normal 10px "Open Sans"',
    colors: [
        '#005CA7', '#39A74A', '#FFC20F', '#777777'
    ],
    slice_innerRadiusEx: 50%,
    selectable: true,
    hoverable: false,
    valuesVisible: false,
    animate: false,
    legend: true,
    legendPosition: 'left',
    stacked: false,
    barOrthoSizeMin: '',
    clickable: false,
    dataSource: '',
    htmlObject: htmlObject,
    executeAtStart: true,
    compatVersion: 2,
    seriesInRows: false,
    clickAction: '',
    listeners: [],
    parameters: [],
    plotFrameVisible: false,
    orthoAxisTicks: false,
    orthoAxisTitleAlign: 'left',
    orthoAxisTitle: '',
    name: ''
  };
  new pvc.SunburstChart(configData)
  .setData(testSunburstThreeLevel)
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