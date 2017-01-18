/**
 * Created by Fine on 2016/1/1.
 */
import $ from 'jquery';

export default function Config() {
  $('.newquery').addClass('hide');
  $('.dataSourceConfig').addClass('hide');
  let template = '<li><span><input class="checkParam" type="checkbox"/></span>' +
    '<input type="text" placeholder="parameter" name="paramName"/>' +
    '<span><input type="checkbox" class="paramListen"/></span></li>';

  $('.addParam').on('click', (e)=>{
    let config = e.target.offsetParent.className.split(' ')[1];

    $('.' + config + ' .chartParameter ul').append(template);
  });
  $('.deleteParam').on('click', (e)=>{
    let nodes = document.querySelectorAll('.checkParam');
    let config = e.target.offsetParent.className.split(' ')[1];

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].checked === true ?
      document.querySelector('.' + config + ' .chartParameter ul')
      .removeChild(nodes[i].parentNode.parentNode) : null;
    }
  });
}
