/**
 * Created by Fine on 2016/11/9.
 */
import ThreeLevelMap from './Olap/ThreeLevelMap';
import TreesLink from './Olap/TreesLink';
import Bubble from './Olap/Bubble';
import WorldMap from './Olap/WorldMap';

// choose olap chart type.
export default function switchOlapChart(option = 'threeLevelMap') {
  let chartType = {
    barChart() {
      console.log('bar');
    },
    lineChart() {
      console.log('line');
    },
    bubbleChart() {
      let bobbleChart = new Bubble();

      bobbleChart.render();
    },
    treesLink() {
      let tree = new TreesLink();

      tree.render();
    },
    threeLevelMap() {
      let map = new ThreeLevelMap();

      map.render();
    },
    worldMap() {
      let map = new WorldMap();

      map.render();
    }
  };

  return chartType[option] ? chartType[option]() : null;
}
