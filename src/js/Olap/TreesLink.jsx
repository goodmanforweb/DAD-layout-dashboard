/**
 * Created by Fine on 2016/11/9.
 */
import { pv } from '../public/protovis';

import OlapChartsRender from '../OlapChart';
import { dataTips, textContent } from '../public/fineChart';

class TreesLink extends OlapChartsRender {
  constructor(props) {
    super(props);
  }

  render() {
    var data = this.process_data_tree({data: this.rawdata}),
      valueTips = this.myself_process_data_tree({data: this.rawdata}),
      headerCnt = this.valueContent,
      options = {
        type: 'treeslink',
        canvas: '.columnOne',
        width: '800',
        height: '400',
        xAxisLabel_textAngle: -Math.PI / 2,
        xAxisLabel_textAlign: 'right',
        xAxisLabel_textBaseline: 'middle'
      },
      nodes = pv.dom(data).nodes(),
      tipOptions = {
        delayIn: 200,
        delayOut: 80,
        offset: 2,
        html: true,
        gravity: 'nw',
        fade: true,
        followMouse: true,
        corners: true,
        arrow: false,
        opacity: 1
      },
      dataNodes = dataTips(valueTips[1], headerCnt);

    var vis = new pv.Panel()
          .width(options.width)
          .height(options.height)
          .canvas(options.canvas);

    var tree = vis.add(pv.Layout.Tree)
          .nodes(nodes)
          .depth(100)
          .breadth(15)
          .orient('radial');

    tree.link.add(pv.Line)
          .lineWidth(1)
          .strokeStyle('rgba(118,103,144,.5)');
    tree.node.add(pv.Dot)
          .shapeSize(10)
          .text(d=>{
            if (d.nodeName !== 'undefined') {
              return textContent(d, dataNodes, headerCnt);
            }
          })
          .event('mousemove', pv.Behavior.tipsy(tipOptions))
          .cursor('pointer')
          .strokeStyle('#1f77b4');
    tree.label.add(pv.Label);
    vis.render();
  }
}
export default TreesLink;
