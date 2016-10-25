import React, { Component } from 'react';
import autoBind from 'react-autobind';
import $ from 'jquery';
import ChartComponent from './ChartComponent';
import widgetComponent from './WidgetComponent';
import '../../style/Components/WidgetPreview';
import '../../style/Components/WidgetConfig';
import WidgetConfig from './WidgetConfig';

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
      let child = target[0].childNodes[0].childNodes;

      for (let s = 0; s < child.length; s++) {
        let name = (child[s].className).split(' ')[1];

        (child[s].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
      if (dataType.indexOf('Chart') >= 0) {
        ChartComponent(dataType, ['.columnOne']);
      }
      else if (dataType.indexOf('grid') < 0) {
        let args = {
          type: dataType,
          node: '.columnOne'
        };

        widgetComponent(args);
      }
    }
    else if (dataType.indexOf('Chart') >= 0) {
      let childNodeList = [];

      target.html(this.layoutDom('gridOne'));
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      for (let n = 0; n < targetChild.childNodes.length; n++) {
        let name = (targetChild.childNodes[n].className).split(' ')[1];

        (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
      ChartComponent(dataType, targetChild.childNodes);
      console.log(ChartComponent(dataType, targetChild.childNodes));
      target[0].className === 'widgetPreview' ?
        null : childNodeList = target[0].parentNode.childNodes;
      for (let l = 0;l < childNodeList.length;l++) {
        childNodeList[l].style.minHeight =
          $(ev.target)[0].offsetHeight + 'px';
      }
      $(ev.target)[0].parentNode.style.minHeight =
        $(ev.target)[0].offsetHeight + 'px';
    }
    else if (dataType.indexOf('grid') >= 0) {
      target.append(this.layoutDom(dataType));
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      for (let n = 0; n < targetChild.childNodes.length; n++) {
        let name = (targetChild.childNodes[n].className).split(' ')[1];

        (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
    }
    else {
      let targetChild = target[0].childNodes[target[0].childNodes.length - 1];

      for (let n = 0; n < targetChild.childNodes.length; n++) {
        let name = (targetChild.childNodes[n].className).split(' ')[1];

        (targetChild.childNodes[n].className).indexOf('widgetConfig') > -1 ?
          WidgetConfig(dataType, name) : null;
      }
      widgetComponent(options);
    }
  }

  layoutDom(type = 'gridOne') {
    let randomNum = new Date().getTime();
    let domType = {
      gridOne() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer">' +
              '<div class = "columnOne"></div>' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "widgetAction"></div>' +
          '</div>'
        );
      },
      gridTwo() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer">' +
              '<div class = "columnTwo"></div>' +
              '<div class = "columnTwo"></div>' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "widgetAction"></div>' +
          '</div>'
        );
      },
      gridThree() {
        return (
          '<div class = "widgetChild">' +
            '<div class = "widgetContainer">' +
              '<div class = "columnThree"></div>' +
              '<div class = "columnThree"></div>' +
              '<div class = "columnThree"></div>' +
            '</div>' +
            '<div class = "widgetConfig config_' + randomNum + '"></div>' +
            '<div class = "widgetAction"></div>' +
          '</div>'
        );
      }
    };

    return domType[type] ? domType[type]() : domType['gridOne']();
  }

  setConfig(ev) {
    let node = $(ev.target)[0].previousSibling;

    if ($(ev.target)[0].className === 'widgetAction') {
      $('.widgetConfig').css({
        display: 'none'
      });
      node.style.zIndex = 100;
      node.style.display = 'block';
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
