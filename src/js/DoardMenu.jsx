/**
 * Created by Fine on 2016/9/25.
 */
import React from 'react';
import $ from 'jquery';
import '../style/Components/DoardMenu';

class DoardMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.setHeight('.boardMenu', 0);
  }

  drag(ev) {
    let data = $(ev.target)[0].attributes;

    for (let i = 0;i < data.length;i++) {
      if (data[i].name === 'data-type') {
        ev.dataTransfer.setData('Text', data[i].nodeValue);
      }
    }
  }

  toggle(ev) {

    if (ev.target.parentNode.nextSibling.style.height === '0px') {
      ev.target.parentNode.nextSibling.style.height = '';
      ev.target.parentNode.childNodes[0].className = 'open';
    }
    else {
      ev.target.parentNode.nextSibling.style.height = '0px';
      ev.target.parentNode.childNodes[0].className = 'close';
    }
  }

  render() {
    return (
      <div className = "boardMenu">
        <div className = "layoutGroup">
          <div className = "layoutLabel label">
              <span className="open" onClick = {this.toggle}/>
              <span onClick = {this.toggle}>布局</span>
          </div>
          <div className = "layoutContent Content">
              <div className = "menuItemBox ">
                  <span className = "menuItem layout1"
                    data-type = "gridOne"
                    draggable = "true"
                    onDragStart = {this.drag}/>
                  <span>
                    布局一
                  </span>
              </div>
              <div className = "menuItemBox ">
                  <span className = "menuItem layout2"
                    data-type = "gridTwo"
                    draggable = "true"
                    onDragStart = {this.drag}/>
                  <span>
                    布局二
                  </span>
              </div>
              <div className = "menuItemBox ">
                  <span className = "menuItem layout3"
                    data-type = "gridThree"
                    draggable = "true"
                    onDragStart = {this.drag}/>
                  <span>
                    布局三
                  </span>
              </div>
          </div>
        </div>
        <div className = "reportGroup">
            <div className = "reportLabel label">
                <span className="open" onClick = {this.toggle}/>
                <span onClick = {this.toggle}>报表文件</span>
            </div>
            <div className = "reportContent Content">
                <div className = "menuItemBox">
                    <span className = "menuItem report1"
                      data-type = "olapPlugin"
                      draggable = "true"
                      onDragStart = {this.drag}/>
                    <span>
                       多维分析
                    </span>
                </div>
            </div>
        </div>
        <div className = "chartGroup">
            <div className = "chartLabel label">
                <span className="open" onClick = {this.toggle}/>
                <span onClick = {this.toggle}>图表</span>
            </div>
            <div className = "chartContent Content">
                <div className = "menuItemBox">
                    <span className = "menuItem chart1"
                        data-type = "barChart"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        柱状图
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem chart2"
                        data-type = "stackedBarChart"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        堆积柱状图
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem chart3"
                        data-type = "lineChart"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        折线图
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem chart4"
                        data-type = "lineBarChart"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        折柱混合图
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem chart5"
                        data-type = "bulletChart"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        子弹图
                    </span>
                </div>
            </div>
        </div>
        <div className = "reportGroup">
            <div className = "reportLabel label">
                <span className="open" onClick = {this.toggle}/>
                <span onClick = {this.toggle}>组件</span>
            </div>
            <div className = "componentContent Content">
                <div className = "menuItemBox">
                    <span className = "menuItem component1"
                        data-type = "table"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        表组件
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem component2"
                        data-type = "query"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        查询组件
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem component3"
                        data-type = "text"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        文本组件
                    </span>
                </div>
            </div>
        </div>

        <div className = "reportGroup">
            <div className = "reportLabel label">
                <span className="open" onClick = {this.toggle}/>
                <span onClick = {this.toggle}>控件</span>
            </div>
            <div className = "controlContent Content">
                <div className = "menuItemBox">
                    <span className = "menuItem control1"
                        data-type = "checkBox"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                      复选框
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem control2"
                        data-type = "radio"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        单选框
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem control3"
                        data-type = "select"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        下拉选择器
                    </span>
                </div>
                <div className = "menuItemBox">
                    <span className = "menuItem control4"
                        data-type = "date"
                        draggable = "true"
                        onDragStart = {this.drag}/>
                    <span>
                        日期选择器
                    </span>
                </div>
            </div>
        </div>
      </div>
	);
  }
}
export default DoardMenu;
