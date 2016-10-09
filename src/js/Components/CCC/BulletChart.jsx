import pvc from '../../public/pvc';

export default function bullet(node) {
  let bullet_NameValueMarker = {
    resultset: [
      ['Europe', 800, 300],
      ['Asia', 100, 500],
      ['Africa', 400, 100]
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

  new pvc.BulletChart({
    canvas: node[0],
    width: 600,
    height: 400,
    orientation: 'horizontal',
    bulletSize: 25,
    bulletSpacing: 50,
    bulletMargin: 100,
    bulletTitle_textStyle: '#333333',
    bulletTitle_font: 'normal 15px "Open Sans"',
    bulletMeasure_fillStyle: '#005CA7',
    bulletRuleLabel_font: 'normal 10px "Open Sans"',
    bulletSubtitle: 'Fixed Sub-title',
    bulletSubtitle_font: 'normal 10px "Open Sans"',
    bulletRanges: [200, 500, 1000]
  })
  .setData(bullet_NameValueMarker)
  .render();
}
