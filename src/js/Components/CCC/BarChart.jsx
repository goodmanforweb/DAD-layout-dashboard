import pvc from '../../public/pvc';

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

  option.chartData ? configData = option.chartData : configData = {
    canvas: option.node[0],
    width: option.node[0].clientWidth - 1,
    height: 400,
    orientation: 'horizontal',
    axisGrid: true,
    crosstabMode: false,
    axisLabel_font: 'normal 10px "Open Sans"',
    colors: '#005CA7',
    selectable: true,
    hoverable: false,
    valuesVisible: false,
    animate: false,
    legendPosition: 'left',
    legend: true,
    stacked: false,
    clickable: false
  };
  new pvc.BarChart(configData)
  .setData(relational)
  .render();

  let chartConfig = {
    configData: configData,
    dataSource: relational
  };

  return chartConfig;
}
