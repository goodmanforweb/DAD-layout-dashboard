
import bar from './CCC/BarChart';
import barLine from './CCC/BarLineChart';
import bullet from './CCC/BulletChart';
import line from './CCC/LineChart';
import stackedBar from './CCC/StackedBarChart';
import OlapChartsRenderer from './OlapChart';

function ChartComponent(args) {
  let chartType = {
    barChart() {
      return bar(args);
    },
    lineBarChart() {
      return barLine(args);
    },
    bulletChart() {
      return bullet(args);
    },
    lineChart() {
      return line(args);
    },
    stackedBarChart() {
      return stackedBar(args);
    },
    olapChart() {
      let OlapCharts = new OlapChartsRenderer();

      return OlapCharts.switchChart();
    }
  };

  return chartType[args.option] ? chartType[args.option]() : null;
}
module.exports = ChartComponent;
