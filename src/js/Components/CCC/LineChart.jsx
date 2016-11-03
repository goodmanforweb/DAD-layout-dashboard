import pvc from '../../public/pvc';

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

  option.chartData ? configData = option.chartData : configData = {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 1,
    height: 400,
    // Data source
    crosstabMode: false,
    // Data
    timeSeries: true,
    // Main plot
    line_interpolate: 'monotone',
    area_interpolate: 'monotone',
    // Cartesian axes
    axisGrid: true,
    axisGrid_strokeStyle: '#F7F8F9',
    axisOffset: 0,
    orthoAxisLabel_font: 'normal 8px "Open Sans"',
    baseAxisLabel_font: 'normal 9px "Open Sans"',
    baseAxisLabel_textAngle: -0.8,
    baseAxisLabel_textAlign: 'right',
    baseAxisScale_dateTickFormat: '%Y/%m/%d',
    baseAxisScale_dateTickPrecision: pvc.time.intervals.w,
    // Panels
    title: 'Time Series Line Chart',
    titleFont: 'lighter 20px "Open Sans"',
    titleMargins: '0 0 5 0',
    legend: true,
    legendFont: 'normal 11px "Open Sans"',
    // Chart/Interaction
    animate: false,
    selectable: true,
    hoverable: true,
    // Color axes
    colors: [
      '#005CA7', '#FFC20F', '#333333'
    ]
  };

  new pvc.LineChart(configData)
  .setData(relational_01)
  .render();
  let chartConfig = {
    configData: configData,
    dataSource: relational_01
  };

  return chartConfig;
}
