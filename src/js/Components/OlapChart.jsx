
class OlapChartsRenderer {
  constructor() {

  }

  ProcessDataTree() {
    console.log('data');
  }

  OptionsChart() {
    console.log('options');
  }

  SelfDataTree() {
    console.log('SelfDataTree');
  }

  switchChart(option = 'barChart') {
    this.ProcessDataTree();
    this.OptionsChart();
    this.SelfDataTree();
    let chartType = {
      barChart() {
        console.log('bar');
      },
      lineBarChart() {
        console.log('lineBar');
      },
      bulletChart() {
        console.log('bullet');
      },
      lineChart() {
        console.log('line');
      },
      stackedBarChart() {
        console.log('stackedBar');
      }
    };

    return chartType[option] ? chartType[option]() : null;
  }
}

module.exports = OlapChartsRenderer;
