/**
 * Created by Fine on 2016/9/25.
 */
import _ from 'underscore';
import d3 from '../public/d3';
import $ from 'jquery';
import '../public/tipsy';
//  import { pv } from '../public/protovis';
import { drawMapPath, data } from '../public/map';
class OlapChartsRenderer {
  constructor() {

  }

  chinaMap() {
    this.type = 'chinamap';
    this.library = 'd3_chart';
    this.rawdata = data;
    var dataSum = this.Privence_data_sum(this.rawdata);
    var options = {
      type: 'chinamap',
      canvas: '.columnOne',
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
      typeChart: this.type,
      spanRedender: $(this.el).find('a.rerender')
    };

    drawMapPath(argsChina);
    //  this.chart = svg;
  };

  process_data_tree(args, flat, setdata) {
    var self = this;
    var data = {};

    if (flat) {
      data.resultset = [];
      data.metadata = [];
      data.height = 0;
      data.width = 0;
    }
    var currentDataPos = data;

    if (typeof args === 'undefined' || typeof args.data === 'undefined') {
      return;
    }
    if (args.data !== null && args.data.error !== null) {
      return;
    }
    // Check to see if there is data
    if (args.data === null || (args.data.cellset && args.data.cellset.length === 0)) {
      return;
    }
    var cellset = args.data.cellset;

    if (cellset && cellset.length > 0) {
      var lowest_level = 0;
      var data_start = 0;
      var hasStart = false;
      var row,
        rowLen,
        labelCol,
        reduceFunction = function(memo, num) {
          return memo + num;
        };

      for (row = 0, rowLen = cellset.length; data_start === 0 && row < rowLen; row++) {
        for (var field = 0, fieldLen = cellset[row].length; field < fieldLen; field++) {
          if (!hasStart) {
            while (cellset[row][field].type === 'COLUMN_HEADER' &&
                cellset[row][field].value === 'null') {
              row++;
            }
          }
          hasStart = true;
          if (cellset[row][field].type === 'ROW_HEADER_HEADER') {
            while (cellset[row][field].type === 'ROW_HEADER_HEADER') {
              if (flat) {
                data.metadata.push({
                  colIndex: field,
                  colType: 'String',
                  colName: cellset[row][field].value
                });
              }
              field++;
            }
            lowest_level = field - 1;
          }
          if (cellset[row][field].type === 'COLUMN_HEADER') {
            var lowest_col_header = 0;
            var colheader = [];

            while (lowest_col_header <= row) {
              if (cellset[lowest_col_header][field].value !== 'null') {
                colheader.push(cellset[lowest_col_header][field].value);
              }
              lowest_col_header++;
            }
            if (flat) {
              data.metadata.push({
                colIndex: field,
                colType: 'Numeric',
                colName: colheader.join(' ~ ')
              });
            }
            data_start = row + 1;
          }
        }
      }
      //  var labelsSet = {};
      var rowlabels = [];

      for (labelCol = 0; labelCol <= lowest_level; labelCol++) {
        rowlabels.push(null);
      }
      for (row = data_start, rowLen = cellset.length; row < rowLen; row++) {
        if (cellset[row][0].value !== '') {
          var record = [];
          var flatrecord = [];
          var parent = null;
          var rv = null;

          for (labelCol = 0; labelCol <= lowest_level; labelCol++) {
            if (cellset[row] && cellset[row][labelCol].value === 'null') {
              currentDataPos = data;
              var prevLabel = 0;

              for (; prevLabel < lowest_level && cellset[row][prevLabel].value === 'null';
                prevLabel++) {
                currentDataPos = currentDataPos[rowlabels[prevLabel]];
              }
              if (prevLabel > labelCol) {
                labelCol = prevLabel;
              }
            }
            if (cellset[row] && cellset[row][labelCol].value !== 'null') {
              if (labelCol === 0) {
                for (var xx = 0; xx <= lowest_level; xx++) {
                  rowlabels[xx] = null;
                }
              }
              if (typeof currentDataPos === 'number') {
                parent[rv] = {};
                currentDataPos = parent[rv];
              }
              rv = cellset[row][labelCol].value;
              rowlabels[labelCol] = rv;
              if (!currentDataPos.hasOwnProperty(rv)) {
                currentDataPos[rv] = {};
              }
              parent = currentDataPos;
              currentDataPos = currentDataPos[rv];
            }
          }
          flatrecord = _.clone(rowlabels);
          for (var col = lowest_level + 1, colLen = cellset[row].length; col < colLen; col++) {
            var cell = cellset[row][col];
            var value = cell.value || 0;
            var maybePercentage = (value !== 0);
            // check if the resultset contains the raw value,  if not try to parse the given value
            var raw = cell.properties.raw;

            if (raw && raw !== 'null') {
              value = parseFloat(raw);
            }
            if (typeof (cell.value) !== 'number' &&
              parseFloat(cell.value.replace(/[^a-zA-Z 0-9.]+/g, ''))
              ) {
              value = parseFloat(cell.value.replace(/[^a-zA-Z 0-9.]+/g, ''));
              maybePercentage = false;
            }
            if (value > 0 && maybePercentage) {
              value = cell.value && cell.value.indexOf('%') >= 0 ? value * 100 : value;
            }
            record.push(value);
            flatrecord.push({f: cell.value, v: value});
          }
          flat ? data.resultset.push(flatrecord) : null;
          var sum = _.reduce(record, reduceFunction, 0);

          rv = (rv === null ? 'null' : rv);
          parent[rv] = sum;
          currentDataPos = data;
        }
      }
      if (setdata) {
        self.rawdata = args.data;
        self.data = data;
        self.hasProcessed = true;
        self.data.height = self.data.resultset.length;
      }
      $(self.el).find('.tipsSpan').hide();
      return data;
    }
  };

  myself_process_data_tree(args, flat) {
    var self = this,
      headerNum, headerCnt = [],
      dataAll = [], doubleString = [],
      singleString = [], data = {},
      content = [], dataInfo = [],
      dataList = [];

    this.valueContent = []; this.doubleHeader;

    if (flat) {
      data.resultset = [];
      data.metadata = [];
      data.height = 0;
      data.width = 0;
    }
    var currentDataPos = data;

    if (typeof args === 'undefined' || typeof args.data === 'undefined') {
      return;
    }
    if (args.data !== null && args.data.error !== null) {
      return;
    }
    // Check to see if there is data
    if (args.data === null || (args.data.cellset && args.data.cellset.length === 0)) {
      return;
    }
    var cellset = args.data.cellset;

    for (var m = 0; m < cellset.length; m++) {
      if (cellset[m][0].type === 'ROW_HEADER_HEADER') {
        headerNum = m;
      }
    }
    cellset[0].forEach(function(n) {
      if (n.type === 'COLUMN_HEADER' && n.value !== 'null') {
        content.push(n.value);
      }
    });
    if (headerNum - 1 >= 0) {
      for (var p = 0;p < cellset[headerNum].length;p++) {
        var headerArr = [],
          titleStr = [];

        if (cellset[headerNum][p].value !== 'null' &&
          cellset[headerNum][p].type === 'COLUMN_HEADER') {
          headerArr.push(cellset[headerNum - 1][p].value);
          headerArr.push(cellset[headerNum][p].value);
          if (cellset[headerNum - 1][p].value === 'null') {
            titleStr = cellset[headerNum][p].value;
          }
          else {
            titleStr = headerArr.join('~');
          }
          headerCnt.push(titleStr);
        }
      }
      for (var b = 0;b < headerCnt.length;b++) {
        var titleString = [], titleArray = [];

        if (headerNum - 1 === 0) {
          titleString = [headerCnt[b]];
        }
        else {
          titleArray = [content[b], headerCnt[b]];
          titleString = titleArray.join('~');
        }
        doubleString.push(titleString);
      }
    }
    if (cellset[0][0].type === 'ROW_HEADER_HEADER') {
      cellset[0].forEach(function(e) {
        if (e.value != null && e.type === 'COLUMN_HEADER') {
          singleString.push(e.value);
        }
      });
      this.valueContent = singleString;
    }
    else {
      this.valueContent = doubleString;
    }
    if (cellset && cellset.length > 0) {
      var lowest_level = 0;
      var data_start = 0;
      var hasStart = false;
      var row, rowLen, labelCol;

      for (row = 0, rowLen = cellset.length; data_start === 0 && row < rowLen; row++) {
        for (var field = 0, fieldLen = cellset[row].length; field < fieldLen; field++) {
          if (!hasStart) {
            while (cellset[row][field].type === 'COLUMN_HEADER' &&
              cellset[row][field].value === 'null') {
              row++;
            }
          }
          hasStart = true;
          if (cellset[row][field].type === 'ROW_HEADER_HEADER') {
            while (cellset[row][field].type === 'ROW_HEADER_HEADER') {
              if (flat) {
                data.metadata.push({
                  colIndex: field,
                  colType: 'String',
                  colName: cellset[row][field].value
                });
              }
              field++;
            }
            lowest_level = field - 1;
          }
          this.doubleHeader = field;
          if (cellset[row][field].type === 'COLUMN_HEADER') {
            var lowest_col_header = 0;
            var colheader = [];

            while (lowest_col_header <= row) {
              if (cellset[lowest_col_header][field].value !== 'null') {
                colheader.push(cellset[lowest_col_header][field].value);
              }
              lowest_col_header++;
            }
            if (flat) {
              data.metadata.push({
                colIndex: field,
                colType: 'Numeric',
                colName: colheader.join(' ~ ')
              });
            }
            data_start = row + 1;
          }
        }
      }
      var rowlabels = [];

      for (labelCol = 0; labelCol <= lowest_level; labelCol++) {
        rowlabels.push(null);
      }
      for (row = data_start, rowLen = cellset.length; row < rowLen; row++) {
        if (cellset[row][0].value !== '') {
          var record = [], flatrecord = [],
            parent = null, rv = null;

          for (labelCol = 0; labelCol <= lowest_level; labelCol++) {
            if (cellset[row] && cellset[row][labelCol].value === 'null') {
              currentDataPos = data;
              var prevLabel = 0;

              for (; prevLabel < lowest_level && cellset[row][prevLabel].value === 'null';
                prevLabel++) {
                currentDataPos = currentDataPos[rowlabels[prevLabel]];
              }
              if (prevLabel > labelCol) {
                labelCol = prevLabel;
              }
            }
            if (cellset[row] && cellset[row][labelCol].value !== 'null') {
              if (labelCol === 0) {
                for (var xx = 0; xx <= lowest_level; xx++) {
                  rowlabels[xx] = null;
                }
              }
              if (typeof currentDataPos === 'number') {
                parent[rv] = {};
                currentDataPos = parent[rv];
              }
              rv = cellset[row][labelCol].value;
              rowlabels[labelCol] = rv;
              if (!currentDataPos.hasOwnProperty(rv)) {
                currentDataPos[rv] = {};
              }
              parent = currentDataPos;
              currentDataPos = currentDataPos[rv];
            }
          }
          flatrecord = _.clone(rowlabels);
          for (var col = lowest_level + 1, colLen = cellset[row].length; col < colLen; col++) {
            var cell = cellset[row][col];
            var value = cell.value || 0;
            var maybePercentage = (value !== 0);
            // check if the resultset contains the raw value,  if not try to parse the given value
            var raw = cell.properties.raw;

            if (raw && raw !== 'null') {
              value = parseFloat(raw);
            }
            else if (typeof (cell.value) !== 'number' &&
              parseFloat(cell.value.replace(/[^a-zA-Z 0-9.]+/g, ''))) {
              value = parseFloat(cell.value.replace(/[^a-zA-Z 0-9.]+/g, ''));
              maybePercentage = false;
            }
            if (value > 0 && maybePercentage) {
              value = cell.value && cell.value.indexOf('%') >= 0 ? value * 100 : value;
            }
            record.push({tipStr: cell.value, arithmetic: value});
            flatrecord.push({f: cell.value, v: value});
          }
          rv = (rv === null ? 'null' : rv);
          parent[rv] = record;
          currentDataPos = data;
        }
        dataInfo.push(flatrecord);
      }
      dataInfo.forEach(function(d) {
        if (d !== undefined) {
          dataList.push(d);
        }
      });
      dataAll.push(data);
      dataAll.push(dataList);
      $(self.el).find('.tipsSpan').hide();
      return dataAll;
    }
  };
  Privence_data_sum(e) {
    var data = this.myself_process_data_tree({data: e});
    var summeta;

    if (this.type === 'worldmap' || this.type === 'multipleworld') {
      // return data[0];
    }
    else {
      if (data[0].中国 !== undefined) {
        summeta = data[0].中国;
      }
      if (data[0].中国 === undefined || data[0].中国 === '' || data[0].中国 === null) {
        summeta = data[0];
      }
    }
    return summeta ? summeta : data[0];
  };

  switchChart(option = 'barChart') {
    this.chinaMap();
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
