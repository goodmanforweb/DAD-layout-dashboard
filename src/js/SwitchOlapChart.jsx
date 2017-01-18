/**
 * Created by Fine on 2016/11/9.
 */
import ThreeLevelMap from './Olap/ThreeLevelMap';
import TreesLink from './Olap/TreesLink';
import Bubble from './Olap/Bubble';
import WorldMap from './Olap/WorldMap';

// choose olap chart type.
export default function switchOlapChart(options) {
  let chartType = {
    barChart() {
      console.log('bar');
    },
    lineChart() {
      console.log('line');
    },
    bubbleChart() {
      let bobbleChart = new Bubble();

      bobbleChart.render(options.node);
    },
    treesLink() {
      let tree = new TreesLink();

      tree.render(options.node);
    },
    threeLevelMap() {
      let map = new ThreeLevelMap();

      map.render(options.node);
    },
    worldMap() {
      let map = new WorldMap();

      map.render(options.node);
    }
  };

  return chartType[options.type] ? chartType[options.type]() : chartType['bubbleChart']();
}
