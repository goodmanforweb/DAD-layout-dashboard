/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

export default function barLine(option) {
  let configData = null;
  let testMeasureDiscrim = {
    metadata: [
      {colName: 'City', colType: 'STRING'},
      {colName: 'Period', colType: 'STRING'},
      {colName: 'Count', colType: 'NUMERIC'},
      {colName: 'AvgLatency', colType: 'NUMERIC'}
    ],
    resultset: [
      ['London', 'Jan', 35000, 141.3],
      ['London', 'Apr', 40000, 120.12],
      ['London', 'Jul', 45000, 115.6],
      ['London', 'Oct', null, 110.37],
      ['Paris', 'Jan', 70000, null],
      ['Paris', 'Apr', 80000, 180.9],
      ['Paris', 'Jul', 115000, 170.7],
      ['Paris', 'Oct', 45000, 145.5],
      ['Lisbon', 'Jan', 70000, 200.7],
      ['Lisbon', 'Apr', 90000, 190.3],
      ['Lisbon', 'Jul', 120000, 180.2],
      ['Lisbon', 'Oct', 30000, 130.067]
    ]
  };
  let htmlObject = option.node[0].parentNode.parentNode.className;

  option.chartData ? configData = option.chartData : configData = {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 1,
    height: 350,
    readers: 'city, period, count, avgLatency',
    dimensions: {
      count: {format: '#,0'},
      avgLatency: {format: '#,0.0'}
    },
    plots: [
      {
        name: 'main',
        visualRoles: {
          value: 'count',
          series: 'city',
          category: 'period'
        }
      },
      {
        type: 'point',
        linesVisible: true,
        dotsVisible: true,
        orthoAxis: 2,
        colorAxis: 2,
        nullInterpolationMode: 'linear',
        visualRoles: {
          value: 'avgLatency',
          color: {legend: {visible: false}}
        }
      }
    ],
    baseAxisTooltipAutoContent: 'summary',
    axisBandSizeRatio: 0.6,
    orthoAxisTitle: '',
    orthoAxisOffset: 0.02,
    orthoAxisGrid: true,
    ortho2AxisTitle: 'Avg. Latency',
    colors: [
      '#005CA7', '#FFC20F', '#333333'
    ],
    color2AxisTransform(c) {
      return c.brighter(0.5);
    },
    orientation: 'vertical',
    valuesVisible: false,
    legend: true,
    legendPosition: 'bottom',
    animate: false,
    selectable: true,
    hoverable: true,
    baseAxisGrid: false,
    tooltipClassName: 'light',
    tooltipOpacity: 1,
    tooltip: '',
    clickable: false,
    barOrthoSizeMin: '',
    dataSource: '',
    htmlObject: htmlObject,
    executeAtStart: true,
    compatVersion: 2,
    crosstabMode: false,
    seriesInRows: false,
    clickAction: '',
    listeners: [],
    parameters: [],
    plotFrameVisible: false,
    orthoAxisTicks: false,
    orthoAxisTitleAlign: 'left',
    name: 'BarLineChart'
  };
  new pvc.BarChart(configData)
  .setData(testMeasureDiscrim)
  .render();
  let dataTitle = {
    id: '',
    type: 'ComponentscccBarLineChart',
    typeDesc: 'CCC Bar Line Chart',
    parent: 'UnIqEiD'
  };
  let chartConfig = {
    configData: configData,
    dataSource: testMeasureDiscrim,
    dataTitle: dataTitle
  };

  return chartConfig;
}
