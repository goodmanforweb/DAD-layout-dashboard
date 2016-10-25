
import bar from './CCC/BarChart';
import barLine from './CCC/BarLineChart';
import bullet from './CCC/BulletChart';
import line from './CCC/LineChart';
import stackedBar from './CCC/StackedBarChart';
import OlapChartsRenderer from './OlapChart';

function ChartComponent(option, node) {
  let chartType = {
    barChart() {
      return bar(node);
    },
    lineBarChart() {
      return barLine(node);
    },
    bulletChart() {
      return bullet(node);
    },
    lineChart() {
      return line(node);
    },
    stackedBarChart() {
      return stackedBar(node);
    },
    olapChart() {
      let OlapCharts = new OlapChartsRenderer();

      return OlapCharts.switchChart();
    }
  };

  return chartType[option] ? chartType[option]() : null;
}
module.exports = ChartComponent;
