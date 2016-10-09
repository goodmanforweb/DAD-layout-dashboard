import bar from './CCC/BarChart';
import barLine from './CCC/BarLineChart';
import bullet from './CCC/BulletChart';
import line from './CCC/LineChart';
import stackedBar from './CCC/StackedBarChart';

function ChartComponent(option, node) {
  let chartType = {
    barChart() {
      bar(node);
    },
    lineBarChart() {
      barLine(node);
    },
    bulletChart() {
      bullet(node);
    },
    lineChart() {
      line(node);
    },
    stackedBarChart() {
      stackedBar(node);
    }
  };

  return chartType[option] ? chartType[option]() : null;
}
module.exports = ChartComponent;
