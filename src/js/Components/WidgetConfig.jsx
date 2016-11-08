/**
 * Created by Fine on 2016/8/25.
 */

import BarConfig from './Config/BarConfig';
import TextConfig from './Config/TextConfig';
import GirdOneConfig from './Config/GirdOneConfig';
import GirdTwoConfig from './Config/GirdTwoConfig';
import GirdThreeConfig from './Config/GirdThreeConfig';
import LineConfig from './Config/LineConfig';
import LineBarConfig from './Config/LineBarConfig';
import BulletConfig from './Config/BulletConfig';
import OlapConfig from './Config/OlapConfig';
import QueryConfig from './Config/QueryConfig';
import RadioConfig from './Config/RadioConfig';
import SelectConfig from './Config/SelectConfig';
import DateConfig from './Config/DateConfig';
import CheckBoxConfig from './Config/CheckBoxConfig';
import StackedBarConfig from './Config/StackedBarConfig';
import TableConfig from './Config/TableConfig';

function WidgetConfig(option, node) {
  let componentType = {
    gridOne() {
      let gridOne = new GirdOneConfig();

      gridOne.renderConfig(node);
    },
    gridTwo() {
      let gridTwo = new GirdTwoConfig();

      gridTwo.renderConfig(node);
    },
    gridThree() {
      let gridThree = new GirdThreeConfig();

      gridThree.renderConfig(node);
    },
    barChart() {
      let barConfig = new BarConfig();

      barConfig.renderConfig(node);
      barConfig.config();
    },
    lineBarChart() {
      let lineBarConfig = new LineBarConfig();

      lineBarConfig.renderConfig(node);
    },
    bulletChart() {
      let bulletConfig = new BulletConfig();

      bulletConfig.renderConfig(node);
    },
    lineChart() {
      let lineConfig = new LineConfig();

      lineConfig.renderConfig(node);
    },
    stackedBarChart() {
      let stackedBarConfig = new StackedBarConfig();

      stackedBarConfig.renderConfig(node);
    },
    olapChart() {
      let olapConfig = new OlapConfig();

      olapConfig.renderConfig(node);
    },
    table() {
      let tableConfig = new TableConfig();

      tableConfig.renderConfig(node);
    },
    query() {
      let queryConfig = new QueryConfig();

      queryConfig.renderConfig(node);
    },
    text() {
      let textConfig = new TextConfig();

      textConfig.renderConfig(node);
    },
    checkBox() {
      let checkBoxConfig = new CheckBoxConfig();

      checkBoxConfig.renderConfig(node);
    },
    radio() {
      let radioConfig = new RadioConfig();

      radioConfig.renderConfig(node);
    },
    select() {
      let selectConfig = new SelectConfig();

      selectConfig.renderConfig(node);
    },
    date() {
      let dateConfig = new DateConfig();

      dateConfig.renderConfig(node);
    }

  };

  return componentType[option] ? componentType[option]() : null;
}

export default WidgetConfig;
