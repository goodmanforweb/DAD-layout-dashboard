/**
 * Created by Fine on 2016/9/25.
 */
import pvc from '../public/pvc';

new pvc.SunburstChart({
    canvas: 'cccSunburstExample1',
    width:  600,
    height: 400,

    // Data source
    crosstabMode: false,

    // Main plot
    valuesFont: 'lighter 11px "Open Sans"',

    // Color axes
    colors: [
        '#005CA7', '#39A74A', '#FFC20F', '#777777'
    ],

    // Chart/Interaction
    selectable: true,
    hoverable:  true,
    tooltip: '',
    clickable: false,
    dataSource: '',
    htmlObject: htmlObject,
    executeAtStart: true,
    compatVersion: 2,
    seriesInRows: false,
    clickAction: '',
    listeners: [],
    parameters: [],
    plotFrameVisible: false,
    orthoAxisTicks: false,
    orthoAxisTitleAlign: 'left',
    name: ''
})
.setData(testSunburstThreeLevel)
.render();