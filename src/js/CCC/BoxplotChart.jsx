/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

new pvc.BoxplotChart({
    canvas: 'cccBoxExample3',
    width:  node[0].clientWidth,
    height: 400,
    orthoAxisTitle: '',

    // Main plot
    boxSizeMax: 20,
    boxRuleWhisker_strokeDasharray: '- ',

    // Second plot
    plot2: true,
    plot2LinesVisible: true,
    plot2Line_shape:   'triangle',
    plot2DotsVisible:  true,
    plots: [
        // minimum, maximum, lowerQuartil, upperQuartil, median
        //{name: 'plot2', visualRoles: {value: 'maximum'}}
    ],

    // Cartesian axes
    baseAxisGrid: true,
    axisGrid_strokeStyle: '#F7F8F9',
    axisLabel_font: 'normal 10px "Open Sans"',

    // Chart/Interaction
    animate:    false,
    selectable: true,
    hoverable:  true,

    // Color axes
    colors: ['#005CA7'],
    tooltip: '',
    clickable: false,
    dataSource: '',
    htmlObject: htmlObject,
    executeAtStart: true,
    compatVersion: 2,
    crosstabMode: true,
    seriesInRows: false,
    clickAction: '',
    listeners: [],
    parameters: [],
    plotFrameVisible: false,
    orthoAxisTicks: false,
    orthoAxisTitleAlign: 'left',
    name: ''
})
.setData(boxplotData_03)
.render();