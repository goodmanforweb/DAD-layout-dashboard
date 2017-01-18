/**
 * Created by Fine on 2016/11/9.
 */
import d3 from '../public/d3';
import $ from 'jquery';

import OlapChartsRender from '../OlapChart';
import { drawMapPath } from '../public/fineChart';

class ThreeLevelMap extends OlapChartsRender {

  constructor(props) {
    super(props);
  }

  render(node) {
    var dataSum = this.Privence_data_sum(this.rawdata);
    var options = {
      type: 'chinamap',
      canvas: node[0],
      width: '800',
      height: '800',
      colors: ['#5AB1EF', '#B6A2DE', '#2EC7C9', '#FFB980', '#97B552', '#D87A80']
    };

    d3.select(options.canvas).selectAll('svg').remove();
    var svg = d3.select(options.canvas).append('svg')
        .attr('width', options.width)
        .attr('height', options.height)
        .append('g')
        .attr('transform', ' translate(' + options.width * 0.3 + ', 0)');

    d3.selectAll('.d3-tip').remove();
    var chinaJsonPath =
      '/xdatainsight/content/saiku-ui/js/saiku/plugins/fine_Chart/mapdata/china.json';
    var argsChina = {
      mapPath: chinaJsonPath,
      svg: svg,
      dataSum: dataSum,
      clickNum: 0,
      panleObj: options,
      typeChart: 'chinamap',
      spanRedender: $(this.el).find('a.rerender')
    };

    drawMapPath(argsChina);
  };
}
export default ThreeLevelMap;
