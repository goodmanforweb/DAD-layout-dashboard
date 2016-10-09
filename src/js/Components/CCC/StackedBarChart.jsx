import pvc from '../../public/pvc';

export default function stackedBar(node) {
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

  new pvc.BarChart({
    canvas: node[0],
    width: 600,
    height: 400,
    // Data source
    crosstabMode: false,
    // Main plot
    stacked: true,
    barStackedMargin: 3,
    valuesVisible: true,
    valuesOptimizeLegibility: true,
    valuesFont: 'lighter 11px "Open Sans"',
    plotFrameVisible: false,
    // Cartesian axes
    axisGrid: true,
    axisOffset: 0,
    axisGrid_strokeStyle: '#F7F8F9',
    axisLabel_font: 'normal 10px "Open Sans"',
    orthoAxisFixedMax: 130,
    baseAxisTicks: true,
    baseAxisTooltipAutoContent: 'summary',
    axisRule_strokeStyle: '#DDDDDD',
    // Panels
    legend: true,
    legendFont: 'normal 11px "Open Sans"',
    // Rubber-band
    rubberBand_strokeStyle: 'rgb(0,0,240)',
    rubberBand_fillStyle: 'rgba(0,0,255, 0.5)',
    rubberBand_lineWidth: 2.5,
    // Chart/Interaction
    animate: false,
    selectable: true,
    hoverable: true,
    // Color axes
    colors: [
      '#005CA7', '#FFC20F', '#333333'
    ]
  })
  .setData(relational_01)
  .render();
}
