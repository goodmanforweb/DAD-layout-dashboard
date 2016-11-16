/**
 * Created by Fine on 2016/11/10.
 */
import d3 from '../public/d3';

import OlapChartsRender from '../OlapChart';
import { drawMapPath } from '../public/fineChart';

class WorldMap extends OlapChartsRender {
  constructor(props) {
    super(props);
  }

  render() {
    var options = {
      type: 'worldmap',
      canvas: '.columnOne',
      width: '800',
      height: '800',
      colors: ['#5AB1EF', '#B6A2DE', '#2EC7C9', '#FFB980', '#97B552', '#D87A80']
    };
    var dataSum = this.Privence_data_sum(this.rawdata);

    d3.select(options.canvas).selectAll('svg').remove();
    var svg = d3.select(options.canvas).append('svg')
      .attr('width', options.width)
      .attr('height', options.height)
      .append('g')
      .attr('transform', 'translate(' + options.width * 0.3 + ',0)');

    d3.selectAll('.d3-tip').remove();
    var worldJsonPath =
      '/xdatainsight/content/saiku-ui/js/saiku/plugins/fine_Chart/mapdata/world-countries.json';
    var argsWorld = {
      mapPath: worldJsonPath,
      svg: svg,
      dataSum: dataSum,
      clickNum: 0,
      panleObj: options,
      typeChart: 'worldmap'
    };

    drawMapPath(argsWorld);
  }
}
module.exports = WorldMap;
