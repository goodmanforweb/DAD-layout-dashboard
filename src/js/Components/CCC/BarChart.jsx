import pvc from '../../public/pvc';

function bar(node) {
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

  new pvc.BarChart({
    canvas: node[0],
    width: 500,
    height: 400,
    orientation: 'horizontal',
    crosstabMode: false,
    axisLabel_font: 'normal 10px "Open Sans"',
    colors: '#005CA7',
    selectable: true,
    hoverable: true,
    valuesVisible: true,
    animate: true,
    legendPosition: 'left',
    legend: true
  })
.setData(relational)
.render();
}

module.exports = bar;
