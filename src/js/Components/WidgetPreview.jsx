import React, { Component } from 'react';
import autoBind from 'react-autobind';
import $ from 'jquery';
import '../../style/Components/WidgetPreview';
import ChartComponent from './ChartComponent';
import widgetComponent from './widgetComponent';

'use strict';
class WidgetPreview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      template: <div className = "waterMark">
        <span className = "dropImg" />
        <span>拖动布局样式到此处</span>
        </div>
    };
    autoBind(this, 'drop');
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drop(ev) {
    ev.preventDefault();
    let target = $(ev.target);
    let dataType = ev.dataTransfer.getData('Text');
    let options = {
      type: dataType,
      node: ev.target
    };

    if (document.querySelector('.waterMark')) {
      $('.waterMark').remove();
      $('.widgetPreview').append(this.layoutDom(dataType));
      if (dataType.indexOf('Chart') >= 0) {
        ChartComponent(dataType, ['.columnOne']);
      }
      else if (dataType.indexOf('gird') <= 0) {
        let args = {
          type: dataType,
          node: '.columnOne'
        };

        widgetComponent(args);
      }
    }
    else if (dataType.indexOf('Chart') >= 0) {
      let childNodeList = [];

      target.append(this.layoutDom('gridOne'));
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      ChartComponent(dataType, targetChild.childNodes);
      if (target[0].className !== 'widgetPreview') {
        childNodeList = target[0].parentNode.childNodes;
      }
      for (let l = 0;l < childNodeList.length;l++) {
        childNodeList[l].style.minHeight =
          $(ev.target)[0].offsetHeight + 'px';
      }
      $(ev.target)[0].parentNode.style.minHeight =
        $(ev.target)[0].offsetHeight + 'px';
    }
    else if (dataType.indexOf('grid') >= 0) {
      $(ev.target).append(this.layoutDom(dataType));
    }
    else {
      widgetComponent(options);
    }
  }

  layoutDom(type = 'gridOne') {
    let domType = {
      gridOne() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "columnOne"></div>' +
          '</div>'
        );
      },
      gridTwo() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "columnTwo"></div>' +
            '<div class = "columnTwo"></div>' +
          '</div>'
        );
      },
      gridThree() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "columnThree"></div>' +
            '<div class = "columnThree"></div>' +
            '<div class = "columnThree"></div>' +
          '</div>'
        );
      }
    };

    return domType[type] ? domType[type]() : domType['gridOne']();
  }

  setConfig(ev) {
    if ($(ev.target)[0].className === 'widgetAction') {
      document.querySelector('.widgetConfig').style.display = 'block';
    }
  }

  render() {
    return (
      <div className = "widgetPreview"
        onClick = {this.setConfig}
        onDrop={this.drop}
        onDragOver={this.allowDrop}>
        {this.state.template}
        </div>
    );
  }
}

export default WidgetPreview;
