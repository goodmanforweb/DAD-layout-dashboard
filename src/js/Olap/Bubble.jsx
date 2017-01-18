/**
 * Created by Fine on 2016/11/10.
 */
import d3 from '../public/d3';

import OlapChartsRender from '../OlapChart';
import { drawBubble } from '../public/fineChart';

class Bobble extends OlapChartsRender {
  constructor(props) {
    super(props);
  }

  render(node) {
    var options = {
        canvas: node[0],
        width: '500',
        height: '400',
        colors: ['#5AB1EF', '#B6A2DE', '#2EC7C9', '#FFB980', '#97B552', '#D87A80']
      },
      data = this.myself_process_data_tree({data: this.rawdata}),
      headerCnt = this.valueContent;

    d3.select(options.canvas).selectAll('svg').remove();
    var svg = d3.select(options.canvas).append('svg')
        .attr({
          'width': options.width,
          'height': options.height
        })
        .append('g')
        .attr('transform', 'translate(0,0)');

    var dataObj = {
      svg: svg,
      options: options,
      data: data,
      headerCnt: headerCnt
    };

    drawBubble(dataObj);
  }
}
module.exports = Bobble;
