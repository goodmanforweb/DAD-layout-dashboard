/**
 * Created by Fine on 2016/3/8.
 */
import _ from 'underscore';
import  d3  from "./d3";
import $ from 'jquery';
import './tipsy';
import { pv } from './protovis';

var fillBubbleColor = function(num){
	var colors = [];
	if(num<=3){
		colors = ['#2DC1E9', '#B7EFFE', '#BAD202'];
	}else if(num<=7){
		colors = ['#00667D', '#1686B6', '#36BEF0','#83AD01','#BAD202',"#FDD900","#FF7A4D"];
	}else if(num<=15){
		colors = ["#00679A","#1686B6","#6068B1","#667FB5","#01BCCD","#2DC1E9","#B7EFFE","#75C5A2",
			"#83AD01","#BAD202","#FDD900","#FCBD56","#FF7A4D","#EC407A","#959595"];
	}else{
		colors = ["#345684","#00679A","#5960A6","#017F96","#00A0B8","#01B6D3","#2DC1E9",
			"#6CC9DA","#B7EFFE","#CCE3DD","#75C5A2","#83AD01","#ADBE22","#BAD202","#FDD900",
			"#FCBD56","#FF7A4D","#EC407A","#D26A9D","#959595"];
	}
	return colors;
}
//bubble draw
var drawBubble = function(bubbleObj){
	var lengthCol  = bubbleObj.headerCnt.length,
		dataArr = bubbleObj.data[1],
		dataNodes = [],
		nodesLength = dataArr.length,
	    color = fillBubbleColor(nodesLength);
	var bubble = d3.layout.pack()
		.sort(null)
		.size([bubbleObj.options.width, bubbleObj.options.height])
		.padding(3.5);
	var node = bubbleObj.svg.selectAll(".node")
		.data(bubble.nodes(classes(dataArr))
		.filter(function(d) {
			return !d.children;
			}
		)
	)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	var tip = d3.behavior.tip()
		.attr({'class':'d3-tip'})
		.offset([-10, 0]);
	bubbleObj.svg.call(tip);
	node.append("circle")
		.on("mouseover",function(d){
			var tipsArray = [];
			for(var t = 0;t<d.valueArr.length;t++){
				var transferHeader = [],
					headerStr = [];
				transferHeader.push(bubbleObj.headerCnt[t]);
				transferHeader.push(d.valueArr[t]);
				headerStr = transferHeader.join(" : ");
				tipsArray.push(headerStr);
			}
			tip.html(d.className+" :</br>"+tipsArray.join("</br>"));
			tip.show();
		})
		.on("mouseleave",function(){
			tip.hide();
		})
		.attr("transform", function() { return "translate(" + 0 + "," + 0 + ")"; })
		.attr("r", 0)
		.transition()
		.delay(function(d,i){
			if(nodesLength<=9){
				return (1500)/nodesLength*i;
			}
			return (800)/nodesLength*i;
		})
		.duration(function(d,i){
			return 1500/nodesLength*i;
		})
		.attr("r", function(d) {
			return d.r+0.5;
		})
		.style("fill", function(d,i) {
			if(d.negativePara == 0){
				var colortip = "#FF4500";
			}else{
				if(color.length<=i){
					var colortip = color[i%color.length];
				}else{
					var colortip = color[i];
				}
			}
			return colortip;
		})
		.style("cursor","default");
	var divide = 0;
	var subLength=0;
	var flag=0;
	if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){divide = 3;subLength=6;flag=1;}
	else if (navigator.userAgent.indexOf('Firefox') >= 0){divide = 3;subLength=6;flag=1;}
	else if (navigator.userAgent.indexOf('Opera') >= 0){divide = 20;}
	else{divide=5;subLength=6;flag=2;}
	var text = node.append("text")
		.on("mouseover",function(d,i){
			var tipsArray = [];
			for(var t = 0;t<d.valueArr.length;t++){
				var transferHeader = [],
					headerStr = [];
				transferHeader.push(bubbleObj.headerCnt[t]);
				transferHeader.push(d.valueArr[t]);
				headerStr = transferHeader.join(" : ");
				tipsArray.push(headerStr);
			}
			tip.html(d.className+" :</br>"+tipsArray.join("</br>"));
			tip.show();
		})
		.on("mouseleave",function(){
			tip.hide();
		})
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) { return d.className.substring(0, d.r/subLength ); })
		.attr("font-size","0")
		.style("fill", "black")
		.transition()
		.duration(function(d,i){
			return 1500/nodesLength*i;
		})
		.delay(function(d,i){
			if(nodesLength<=9){
				return 800/nodesLength*i+1;
			}
			return 1500/nodesLength*i+1;
		})
		.attr("font-size",function(d){
			if(flag==1){
				if(d.r/divide<=12){return 12;}
			}
			return d.r/divide;
		})
		.style("cursor","default");
	function classes(root){
		root.forEach(function(d){
			var titleLoc = d.length - lengthCol,
				dataFloat = [],
				negative = null;
			for(var a = titleLoc;a<d.length;a++){
				dataFloat.push(d[a].f);
			}
			if(titleLoc-2>=0){
				var packageNum = d[titleLoc-2];
			}else{
				var packageNum = d[titleLoc-1];
			}
			if(d[titleLoc].v<=0){
				negative = 0
				d[titleLoc].v = -(d[titleLoc].v);
			}
			if(d[titleLoc-1]!= null){
				var dataObj = {
					packageName: packageNum,
					className: d[titleLoc-1],
					value: d[titleLoc].v,
					valueArr:dataFloat,
					negativePara:negative
				}
				dataNodes.push(dataObj);
			}
		})
		return {children: dataNodes};
	}
}
//radar draw
var drawRadar = function(radarObj){
	var id = '#'+radarObj.options.canvas,
		dataArr = radarObj.data[1];
	radarObj.svg.attr("transform", "translate("+radarObj.options.width*0.5+","+radarObj.options.height*0.55+")")
		.attr("class", "radar"+id);
	var color = d3.scale.ordinal()
		          .range(radarObj.options.colors),
        radarChartOptions = {
		w: radarObj.options.width*0.7,
		h: radarObj.options.height*0.7,
		margin: 5,
		maxValue: 0.5,
		levels: 5,
		roundStrokes: true,
		width:radarObj.options.width,
		height:radarObj.options.height,
		color: color,
		svg:radarObj.svg,
		headerCnt:radarObj.headerCnt
	};
	var data = radarData(dataArr,radarObj.headerCnt);
	RadarPath(data,radarChartOptions);
}
//draw radar path
var RadarPath = function(data, options) {
	var cfg = {
		w: 600,				//Width of the circle
		h: 600,				//Height of the circle
		margin: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},                     //The margins of the SVG
		levels: 3,				//How many levels or inner circles should there be drawn
		maxValue: 0, 			//What is the value that the biggest circle will represent
		labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
		wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
		opacityArea: 0.35, 	//The opacity of the area of the blob
		dotRadius: 4, 			//The size of the colored circles of each blog
		opacityCircles: 0.1, 	//The opacity of the circles of each blob
		strokeWidth: 2, 		//The width of the stroke around each blob
		roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
		color: d3.scale.category10()	//Color function
	};
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
		for(var i in options){
			if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
		}
	}
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){
		return d3.max(i.map(function(o){
			return o.value.v;
			}
		))
	}));
	var allAxis = (data[0].map(function(i, j){return i.key})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
	//explain color
	var parentTitle = options.svg.append("g")
		.attr({
			"transform":"translate("+(-options.width*0.4)+","+(-options.height*0.5)+")"
		})
		.style({
			"font-variant": "normal",
			"font-stretch": "normal",
			"font-size":"15px"
		});
	var childTitle = parentTitle.selectAll(".childInfo")
		.data(options.headerCnt).enter()
		.append("g")
		.attr({
			"class": "childInfo",
			"transform":function(d,i){
				return "translate("+(i*150)+","+(-7)+")";
			}
		});
	var textTitle = parentTitle.selectAll(".textInfo")
		.data(options.headerCnt).enter()
		.append("g")
		.attr({
		"class": "textInfo",
		"transform":function(d,i){
			return "translate("+(i*150+20)+","+0+")";
		}
	});
	textTitle.append("text")
		.attr({
			"class":"textColor",
			"font-style":"normal" ,
			"font-variant": "normal",
			"font-weight": "normal",
			"font-stretch": "normal",
			"font-size": "15px",
			"line-height": "normal",
			"font-family": "sans-serif"
		})
		.text(function(d){
			return d;
	   })
	childTitle.append("circle")
		.attr({
			"r":8,
			"class":"circleColor"
		})
		.style({
			"fill":function(d,i){
				return cfg.color(i)
			},
			"stroke":function(d,i){
				return cfg.color(i)
			}
		})
	//Append a g element
	var g = options.svg.append("g")
	//Filter for the outside glow
	var filter = g.append('defs')
			.append('filter')
			.attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur')
			.attr('stdDeviation','2.5')
			.attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode')
			.attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode')
			.attr('in','SourceGraphic');
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	//Draw the background circles
	axisGrid.selectAll(".levels")
		.data(d3.range(1,(cfg.levels+1)).reverse())
		.enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){
			return radius/cfg.levels*d;
		})
		.style({
			"fill": "#CDCDCD",
			"stroke": "#CDCDCD",
			"fill-opacity": cfg.opacityCircles,
			"filter" : "url(#glow)"
		});
	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
		.data(d3.range(1,(cfg.levels+1)).reverse())
		.enter().append("text")
		.attr("class", "axisLabel")
		.attr("x", 4)
		.attr("y", function(d){
			return -d*radius/cfg.levels;
		})
		.attr("dy", "0.4em")
		.style("font-size", "10px")
		.attr("fill", "#737373")
		//.text(function(d,i) { return maxValue * d/cfg.levels; });
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){
			return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2);
		})
		.attr("y2", function(d, i){
			return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2);
		})
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");
	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){
			return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2);
		})
		.attr("y", function(d, i){
			return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2);
		})
		.text(function(d){
			return d;
		})
		.call(wrap, cfg.wrapWidth);
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) {
			return rScale(d.value.v);
		})
		.angle(function(d,i) {
			return i*angleSlice;
		});
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
	//Create a wrapper for the blobs
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
	//Append the backgrounds
	blobWrapper.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) {
			return radarLine(d);
		})
		.style("fill", function(d,i) {
			return cfg.color(i);
		})
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.8);
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){
			return rScale(d.value.v) * Math.cos(angleSlice*i - Math.PI/2);
		})
		.attr("cy", function(d,i){
			return rScale(d.value.v) * Math.sin(angleSlice*i - Math.PI/2);
		})
		.style("fill", function(d,i,j) {
			return cfg.color(j);
		})
		.style("fill-opacity", 0.8);
	var tip = d3.behavior.tip()
		.attr({'class':'d3-tip'})
		.offset([-10, 0]);
	options.svg.call(tip);
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){
			return rScale(d.value.v) * Math.cos(angleSlice*i - Math.PI/2);
		})
		.attr("cy", function(d,i){
			return rScale(d.value.v) * Math.sin(angleSlice*i - Math.PI/2);
		})
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			tip.html(d.key+" : "+d.value.f);
			tip.show();
		})
		.on("mouseout", function(){
			tip.hide();
		});
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	//Wraps SVG text
	function wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null)
					.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", dy + "em");
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan")
						.attr("x", x)
						.attr("y", y)
						.attr("dy", ++lineNumber * lineHeight + dy + "em")
						.text(word);
				}
			}
		});
	}
}
//radar data process
var radarData = function(dataArr,headerCnt){
	var childArr = [];
	for(var b = 0;b<headerCnt.length;b++){
		childArr[b] = [];
	}
	for(var d=0;d<dataArr.length;d++){
		var s= 0,
			dataLength = dataArr[d].length - headerCnt.length;
		for(var a = dataLength; a<dataArr[d].length;a++){
			var childObj = {};
			childObj = {
				key:dataArr[d][dataLength-1],
				value:dataArr[d][a]
			}
			childArr[s].push(childObj);
			s++;
		}
	}
	return childArr;
}
//color data node
var colorHandle = function(colorParam){
	var sortParam = colorParam.sort(compare);
	if(sortParam.length%5==0){
		var share = parseInt(sortParam.length/5);
	}else{
		if(sortParam.length%5>=3) {
			var share = parseInt(sortParam.length / 5)+1;
		}else{
			var share = parseInt(sortParam.length / 5);
		}
	}
	var rangeData = [];
	if(sortParam.length<=6){
		rangeData = sortParam;
	}else if(sortParam.length<=7){
		for(var n=0;n<5;n++){
			rangeData.push(sortParam[n])
		}
		rangeData.push(sortParam[sortParam.length-1]);
	}else if(sortParam.length>7){
		for(var n=0;n<5;n++){
			if(n==0){
				rangeData.push(sortParam[0]);
			}else{
				rangeData.push(sortParam[share*n-1]);
			}
		}
		rangeData.push(sortParam[sortParam.length-1]);
	}
	if(rangeData.length<6){
		for(var m = rangeData.length;m<6;m++){
			rangeData[m] = 0;
		}
	}
	return rangeData;
}
//multiple color range chose
var fillColor = function(dataValue,rangeData){
	var colorParam = {
		a:d3.rgb(253,217,0),
		b:d3.rgb(187,211,1),
		c:d3.rgb(131,173,0),
		d:d3.rgb(54,191,241),
		e:d3.rgb(22,135,183),
		f:d3.rgb(0,102,124)
	}
	if(dataValue<=rangeData[4]){
		var minParam=rangeData[5];
		var maxParam = rangeData[4];
		var computeColor = d3.interpolate(colorParam.a,colorParam.b);
	}else if(dataValue<=rangeData[3]){
		var minParam=rangeData[4];
		var maxParam = rangeData[3];
		var computeColor = d3.interpolate(colorParam.b,colorParam.c);
	}else if(dataValue<=rangeData[2]){
		var minParam=rangeData[3];
		var maxParam = rangeData[2];
		var computeColor = d3.interpolate(colorParam.c,colorParam.d);
	}else if(dataValue<=rangeData[1]){
		var minParam=rangeData[2];
		var maxParam = rangeData[1];
		var computeColor = d3.interpolate(colorParam.d,colorParam.e);
	}else if(dataValue<=rangeData[0]){
		var minParam=rangeData[1];
		var maxParam = rangeData[0];
		var computeColor = d3.interpolate(colorParam.e,colorParam.f);
	}
	var linear = d3.scale.linear()
		.domain([minParam, maxParam])
		.range([0, 1]);
	var t = linear(dataValue);
	var color = computeColor(t);
	if(dataValue<0){
		color = "#FF7A4C";
	}else if(dataValue==0){
		color = "#E0FFFF";
	}
	return color;
}
//world and china map draw
var drawMapPath = function (argsChina){
	var nodes = [],
		nodesSum = d3.entries(argsChina.dataSum),
		mapSum = d3.map(argsChina.dataSum),
		dataFill= [],
		lengthNum = [];
	nodesSum.forEach(function(s){
		dataFill.push(s.value);
	})
	dataFill.forEach(function(d){
		lengthNum.push(d.length);
	})
	var lengthArray = d3.max(lengthNum);
	var doubleData = [];
	for(var b=0;b<lengthArray;b++){
		doubleData[b]=[];
	}
	dataFill.map(function(d){
		for(var e=0;e< d.length;e++){
			doubleData[e].push(d[e].arithmetic);
		}
	})
	if(doubleData[0]){
		var rangeData = colorHandle(doubleData[0]);
	}
	d3.json(argsChina.mapPath, function(error, root) {
		var backColor,path;
		if (error)
			return console.error(error);
		if(argsChina.typeChart=="worldmap"){
			var zoomScale = getZoomScale(root.features, argsChina.panleObj.width, argsChina.panleObj.height);
			var projection = d3.geo.mercator()
				.center([6, 35])
				.scale(zoomScale*46)
				.translate([argsChina.panleObj.width/5, argsChina.panleObj.height*0.6]);
			path = d3.geo.path().projection(projection);
		}else if(argsChina.typeChart=="chinamap"){
			var zoomScale = getZoomScale(root.features, argsChina.panleObj.width, argsChina.panleObj.height);
			var projection = d3.geo.mercator()
				.center([107, 38])
				.scale(zoomScale*43)
				.translate([argsChina.panleObj.width/5, argsChina.panleObj.height/2]);
			path = d3.geo.path().projection(projection);
		}
		var tip = d3.behavior.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0]);
		argsChina.svg.call(tip);
		argsChina.svg.selectAll(".pathChina")
			.data(function(){
				if(argsChina.typeChart=="chinamap"){
					return root.features;
				}else if(argsChina.typeChart=="worldmap"){
					var features = _.filter(root.features, function(value) {
						return value.properties.name != '南极洲';
					});
					return features;
				}
			})
			.enter()
			.append("path")
			.attr("d", path)
			.attr("class", "pathChina")
			.attr("stroke","#000")
			.attr("stroke-width", 0.3)
			.attr("fill", function(d){
				var nameNode=d.properties.name;
				var dataValue=[];
				nodesSum.forEach(function(m){
					if(m.key==nameNode){
						if(typeof m.value === 'object' && !isNaN(m.value.length)){
							dataValue.push(m.value[0].arithmetic);
						}else{
							dataValue=0;
						}
					}
				})
				if(rangeData){
					return fillColor(dataValue,rangeData);
				}else if(dataValue=="undefined"||dataValue==null||dataValue==""||dataValue==0||!rangeData){
					return "#E0FFFF";
				}
			})
			.on("mousedown", d3.behavior.zoom())
			.on("mouseover",function(d){
				var overColor = "#FFB980";
				backColor = d3.select(this).attr("fill");
				d3.select(this)
					.attr("fill", overColor)
				var nameNode=d.properties.name;
				var nodemap=[];
				nodesSum.forEach(function(n){
					if(n.key==nameNode){
						nodemap.push(n.value[argsChina.clickNum].tipStr);}
				})
				if(nodemap==null||nodemap==""){nodemap=0;}
				tip.html(nameNode+":"+nodemap);
				tip.show();
			})
			.on("mouseout",function(){
				d3.select(this)
					.attr("fill",backColor);
				tip.hide();
			})
			.on("click",function(d,i){
				if(argsChina.typeChart=="chinamap"){
					var sumCountry = {};
					var id = d.properties.id;
					var name = d.properties.name;
					mapSum.forEach(function(m,i){
						if(m==name){
							sumCountry=i;
						}
					});
					d3.selectAll(".pathProvince").remove();
					d3.selectAll(".pathCouty").remove();
					var pathProvince="/xdatainsight/content/saiku-ui/js/saiku/plugins/fine_Chart/mapdata/geometryProvince/" + id + ".json";
					var argsProvince ={
						d:d,
						mapPath:pathProvince,
						svg:argsChina.svg,
						dataNodes:argsChina.dataNodes,
						dataSum:argsChina.dataSum,
						sumCountry:sumCountry,
						panleObj:argsChina.panleObj,
						typeChart:argsChina.typeChart,
						spanRedender:argsChina.spanRedender
					}
					clickMap(argsProvince);
				}
			});
		var colorParam = {
			a:d3.rgb(253,217,0),
			b:d3.rgb(187,211,1),
			c:d3.rgb(131,173,0),
			d:d3.rgb(54,191,241),
			e:d3.rgb(22,135,183),
			f:d3.rgb(0,102,124)
		}
		colorMultiple(argsChina.svg,colorParam,argsChina.panleObj,rangeData[0],rangeData[5]);
		//get center coordinate
		root.features.forEach(function(d, i) {
			var centroid = path.centroid(d);
			centroid.x = centroid[0];
			centroid.y = centroid[1];
			centroid.id = d.properties.id;
			centroid.name = d.properties.name;
			centroid.feature = d;
			nodes.push(centroid);
		});
	});
	if(argsChina.typeChart=="chinamap"){
		argsChina.spanRedender.hide();
	}
}
//click China map
var clickMap = function(argsProvince){
	d3.selectAll(".pathChina").remove();
	d3.selectAll(".d3-tip").remove();
	drawPrivenceMap(argsProvince);
}
//Privence Map draw
var drawPrivenceMap = function(argsProvince) {
	var background,
		provinceNodes=[],
		dataFill=[];
	var sumCount=d3.entries(argsProvince.sumCountry);
	var mapSum = d3.entries(argsProvince.dataSum);
	if(sumCount==""||sumCount==null||sumCount.length<=1){
		mapSum.forEach(function(n){
			if(n.key!="undefined"|| n.key!=null){
				if(typeof n.value === 'object' && !isNaN(n.value.length)){
					dataFill.push(n.value[0].arithmetic);
				}
			}
		});
	}else{
		sumCount.forEach(function(d){
			if(typeof d.key !="number"){
				if(typeof d.value === 'object' && !isNaN(d.value.length)){
					dataFill.push(d.value[0].arithmetic);
				}
			}
		});
	}
	if(dataFill[0]){
		var rangeData = colorHandle(dataFill);
	}
	d3.json(argsProvince.mapPath, function(error, root) {
		var zoomScale = getZoomScale(root.features, argsProvince.panleObj.width, argsProvince.panleObj.height);
		var centers = getCenters(root.features);
		if (error)
			return console.error(error);
		var projection = d3.geo.mercator()
			.center(centers)
			.scale(zoomScale*36)
			.translate([argsProvince.panleObj.width/4, argsProvince.panleObj.height/2]);
		var path = d3.geo.path().projection(projection);
		var tip = d3.behavior.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0]);
		argsProvince.svg.call(tip);
		argsProvince.svg.selectAll(".pathProvince")
			.data(root.features)
			.enter()
			.append("path")
			.attr("class", "pathProvince")
			.attr("stroke","#000")
			.attr("stroke-width",0.3)
			.attr("fill", function(d){
				var nameNode=d.properties.name;
				var valueArray = [];
				if(sumCount ==""||sumCount==null||sumCount.length<=1){
					mapSum.forEach(function(n){
						if(n.key==nameNode) {
							if(typeof n.value === 'object' && !isNaN(n.value.length)){
								valueArray.push(n.value[0].arithmetic);
							}else{
								valueArray=1;
							}
						}
					})
				} else{
					sumCount.forEach(function(j){
						if(j.key==nameNode){
							if(typeof j.value === 'object' && !isNaN(j.value.length)){
								valueArray.push(j.value[0].arithmetic);
							}
						}
					})
				}
				if(rangeData){
					return fillColor(valueArray,rangeData);
				}else if(valueArray=="undefined"||valueArray==null||valueArray==""||!rangeData){
					return "#E0FFFF";
				}
			})
			.attr("d", path )
			.on("mouseover",function(d){/*todoprovince*/
				background = d3.select(this).attr("fill");
				var nameNode=d.properties.name;
				var nodemap=[];
				if(sumCount ==""||sumCount==null){
					mapSum.forEach(function(i){
						if(i.key==nameNode) {
							nodemap.push(i.value[0].tipStr);
						}
					})
				}else{
					sumCount.forEach(function(m){
						if(m.key==nameNode){
							nodemap.push(m.value[0].tipStr);
						}
					})
				}
				if(nodemap==null||nodemap==""){
					nodemap=0;}
				tip.html(nameNode+":"+nodemap);
				tip.show();
			})
			.on("mouseout",function(d,i){
				d3.select(this)
					.attr("fill",background);
				tip.hide();
			})
			.on("click",function(d,i){
				tip.hide();
				var nameNode=d.properties.name;
				var cnt = [];
				if(sumCount ==""||sumCount==null){
					mapSum.forEach(function(n){
						if(n.key==nameNode) {cnt = n.value;}
					})
				} else{
					sumCount.forEach(function(j,h){
						if(j.key==nameNode){cnt = j.value;}
					})
				}
				var argsCountry={
					d:d,
					svg:argsProvince.svg,
					dataCountry:argsProvince.dataNodes,
					dataSum:argsProvince.dataSum,
					cnt:cnt,
					panleObj:argsProvince.panleObj,
					typeChart:argsProvince.typeChart,
					spanRedender:argsProvince.spanRedender
				}
				clickProvince(argsCountry);
			});
		//get center coordinate
		root.features.forEach(function(d) {
			var centroid = path.centroid(d);
			centroid.x = centroid[0];
			centroid.y = centroid[1];
			centroid.id = d.properties.id;
			centroid.name = d.properties.name
			centroid.feature = d;
			provinceNodes.push(centroid);
		})
	});
	argsProvince.spanRedender.show();
}
//click province map
var clickProvince = function(argsCountry) {
	d3.selectAll(".pathProvince").remove();
	d3.selectAll(".pathChina").remove();
	drawCoutyMap(argsCountry);
}
//Country Map draw
var drawCoutyMap = function(argsCountry) {
	var backColor;
	var id = argsCountry.d.properties.id;
	var dataFill=[],coutiesNodes=[];
	var count = d3.entries(argsCountry.cnt);
	var dataSum = d3.entries(argsCountry.dataSum);
	if(count==""||count==null){
		dataSum.forEach(function(n){
			if(typeof n.value === 'object' && !isNaN(n.value.length)){
				dataFill.push(n.value[0].arithmetic);
			}
		});
	}else{
		count.forEach(function(m){
			if(typeof m.value === 'object' && !isNaN(m.value.length)){
				dataFill.push(m.value[0].arithmetic);
			}
		})
	}
	if(dataFill[0]){
		var rangeData = colorHandle(dataFill);
	}
	var mapPath = "/xdatainsight/content/saiku-ui/js/saiku/plugins/fine_Chart/mapdata/geometryCouties/" + id + "00.json";
	var tip = d3.behavior.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0]);
	argsCountry.svg.call(tip);
	d3.json(mapPath, function(error, root) {
		if (error)
			return console.error(error);
		var zoomScale = getZoomScale(root.features, argsCountry.panleObj.width, argsCountry.panleObj.height);
		var centers = getCenters(root.features);
		var projection = d3.geo.mercator()
			.center(centers)
			.scale(zoomScale*35)
			.translate([argsCountry.panleObj.width/4, argsCountry.panleObj.height/2]);
		var path = d3.geo.path().projection(projection);
		argsCountry.svg.selectAll(".pathCouty")
			.data( root.features )
			.enter()
			.append("path")
			.attr("class", "pathCouty")
			.attr("stroke","#000")
			.attr("stroke-width",0.3)
			.attr("fill", function(d,i){
				var nameNode=d.properties.name;
				var valueArray = [];
				if(count==null||count==""){
					dataSum.forEach(function(r){
						if(r.key==nameNode) {
							valueArray.push(r.value[0].arithmetic);
						}
					})
				}else{
					count.forEach(function(n){
						if(n.key==nameNode) {
							valueArray.push(n.value[0].arithmetic);
						}
					})
				}
				if(rangeData){
					return fillColor(valueArray,rangeData);
				}else if(valueArray=="undefined"||valueArray==null||valueArray==""||!rangeData){
					return "#E0FFFF";
				}
			})
			.attr("d", path)
			.on("mouseover",function(d){
				backColor = d3.select(this).attr("fill");
				var nameNode=d.properties.name;
				var nodemap=[];
				if(count==""||count==null){
					dataSum.forEach(function(r){
						if(r.key==nameNode) {
							nodemap.push(r.value[0].tipStr);
						}
					})
				}else{
					count.forEach(function(n){
						if(n.key==nameNode){
							nodemap.push(n.value[0].tipStr);
						}
					})
				}
				if(nodemap==null||nodemap==""){
					nodemap=0;
				}
				tip.html(nameNode+":"+nodemap);
				tip.show();
			})
			.on("mouseout",function(d,i){
				tip.hide();
				d3.select(this)
					.attr("fill",backColor);
			}).on("click",function(d,i){
				tip.hide();
				var countryObj = {
					svg:argsCountry.svg,
					data:argsCountry.dataCountry,
					dataSum:argsCountry.dataSum,
					panleObj:argsCountry.panleObj,
					spanRedender:argsCountry.spanRedender
				}
				clickCouty(countryObj);
			});
		//get center coordinate
		root.features.forEach(function(d, i) {
			var centroid = path.centroid(d);
			centroid.x = centroid[0];
			centroid.y = centroid[1];
			centroid.id = d.properties.id;
			centroid.name = d.properties.name
			centroid.feature = d;
			coutiesNodes.push(centroid);
		});
	});
}
//click country map
var clickCouty = function(countryData){
	d3.selectAll(".pathProvince").remove();
	d3.selectAll(".pathCouty").remove();
	countryData.spanRedender.hide();
	var chinaJsonPath = "/xdatainsight/content/saiku-ui/js/saiku/plugins/fine_Chart/mapdata/china.json";
	var argsChina = {
		mapPath:chinaJsonPath,
		svg:countryData.svg,
		dataNodes:countryData.data,
		dataSum:countryData.dataSum,
		clickNum:0,
		panleObj:countryData.panleObj,
		typeChart:"chinamap",
		spanRedender:countryData.spanRedender
	}
	drawMapPath(argsChina);
}

var getCenters = function(features){
	var longitudeMin = 100000;//最小经度
	var latitudeMin = 100000;//最小维度
	var longitudeMax = 0;//最大经度
	var latitudeMax = 0;//最大纬度
	features.forEach(function(e){
		var a = d3.geo.bounds(e);//[[最小经度，最小维度][最大经度，最大纬度]]
		if(a[0][0] < longitudeMin) {
			longitudeMin = a[0][0];
		}
		if(a[0][1] < latitudeMin) {
			latitudeMin = a[0][1];
		}
		if(a[1][0] > longitudeMax) {
			longitudeMax = a[1][0];
		}
		if(a[1][1] > latitudeMax) {
			latitudeMax = a[1][1];
		}
	});
	var a = (longitudeMax + longitudeMin)/2;
	var b = (latitudeMax + latitudeMin)/2;
	return [a, b];
}

var getZoomScale = function(features, width, height){
	var longitudeMin = 100000;//最小经度
	var latitudeMin = 100000;//最小维度
	var longitudeMax = 0;//最大经度
	var latitudeMax = 0;//最大纬度
	features.forEach(function(e){
		var a = d3.geo.bounds(e);//[[最小经度，最小维度][最大经度，最大纬度]]
		if(a[0][0] < longitudeMin) {//左
			longitudeMin = a[0][0];
		}
		if(a[0][1] < latitudeMin) {/*上*/
			latitudeMin = a[0][1];
		}
		if(a[1][0] > longitudeMax) {/*右*/
			longitudeMax = a[1][0];
		}
		if(a[1][1] > latitudeMax) {/*下*/
			latitudeMax = a[1][1];
		}
	});
	var a = longitudeMax-longitudeMin;/*数值宽度*/
	var b = latitudeMax-latitudeMin;/*数值高度*/
	if(width/height>=a/b){
		return height/b;
	} else{
		return width/a;
	}
}
// draw multiple china map
var drawMultipleMap = function(argsMultiple) {
	var vauleCnt = argsMultiple.vauleCnt,
		lengthNum = vauleCnt.length,
		clickNum = [0],
		randNum = new Date().getTime(),
		padding = 60,
		axisw,
		r = 4,
		circleNum = 0;
	var svgTimeAxis = argsMultiple.svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (-argsMultiple.panleObj.width / 6) + ",0)");
	if (lengthNum <= 1) {
		axisw = 0;
	} else {
		axisw = argsMultiple.panleObj.width - 5 * padding;
	}
	var axish = argsMultiple.panleObj.height;
	svgTimeAxis.append("line")
		.attr({
			"x1": 0,
			"y1": axish,
			"x2": axisw,
			"y2": axish,
			"stroke": "#63B8FF",
			"stroke-dasharray":"5,5"
		})
	var xScale = d3.scale.linear()
		.domain([0, vauleCnt.length - 1])
		.range([0, axisw]);
	var circles = svgTimeAxis.selectAll("circle"+randNum)
		.data(vauleCnt).enter()
		.append("circle")
		.attr("class", "circle"+randNum)
		.attr("id", function (d) {return d;})
		.style("stroke", function () {return "#63B8FF";})
		.style("fill", function () {return "#ffffff";});
	var tip = d3.behavior.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0]);
	argsMultiple.svg.call(tip);
	circles.attr("cx", function (d, i) {return xScale(i);})
		.on("click", function (w) {
			var a = [];
			for (var z = 0; z < circles[0].length; z++) {
				if (circles[0][z].id == w) {a.push(z);}
			}
			circleNum = a[0];
		})
		.style("cursor","pointer")
		.attr("cy", axish)
		.attr("r", r)
		.append("title")
		.text(function(d){return d});
	var texts = svgTimeAxis.selectAll("text")
		.data(vauleCnt).enter()
		.append("text")
		.text(function(d){return d;})
		.attr({
			"transform":function(d,i){
				return "translate("+(xScale(i)+3)+","+(axish+10)+"), rotate(-90)"
			}
		})
		.style({
			"font-size": "12px",
			"font-family": "sans-serif",
			"fill": "rgb(102, 102, 102)",
	        "text-anchor": "end"
		});
	if(vauleCnt.length<=1){
		d3.selectAll(".circle"+randNum)
			.style("opacity","0");
		texts.style("opacity","0");
	}
	setInterval(function () {
		var args = {
			circleObj:circles[0][circleNum],
			clickNum:clickNum,
			circle_id:circles[0][circleNum].id,
			vauleCnt:vauleCnt,
			mapPath:argsMultiple.mapPath,
			svg:argsMultiple.svg,
			panleObj:argsMultiple.panleObj,
			dataSum:argsMultiple.dataSum,
			tip:tip,
			randNum:randNum,
			typeChart:argsMultiple.typeChart
		};
		clickAxis(args);
		circleNum++;
		if (circleNum >= circles[0].length) {
			circleNum = 0;
		}
	}, 3000);
	var multipleChina = {
		mapPath:argsMultiple.mapPath,
		svg:argsMultiple.svg,
		panleObj:argsMultiple.panleObj,
		dataSum:argsMultiple.dataSum,
		clickNum:clickNum,
		tip:tip,
		randNum:randNum,
		typeChart:argsMultiple.typeChart
	}
	drawMultipleChina(multipleChina);
}
// draw  multiple china map initial status
var drawMultipleChina = function (multipleChina){
	var nodes=[];
	var nodesSum=d3.entries(multipleChina.dataSum);
	var dataFill=[];
	var lengthNum = [];
	nodesSum.forEach(function(s){
		dataFill.push(s.value);
	})
	dataFill.forEach(function(d){
		lengthNum.push(d.length);
	})
	var lengthArray = d3.max(lengthNum);
	var doubleData = [],maxvalue = [], minvalue = [];
	for(var b=0;b<lengthArray;b++){
		doubleData[b]=[];
	}
	dataFill.forEach(function(d){
		for(var e=0;e< d.length;e++){
			doubleData[e].push(d[e].arithmetic);
		}
	})
	doubleData.forEach(function(d){
		maxvalue.push(d3.max(d));
		minvalue.push(d3.min(d));
	})
	for(var t = 0;t<maxvalue.length;t++){
		if(maxvalue[t]==minvalue[t]){
			minvalue[t]=[0];
		}
	}
	d3.json(multipleChina.mapPath, function(error, root) {
		var backColor,
			path;
		if (error)
			return console.error(error);
		if(multipleChina.typeChart=="multipleworld"){
			var zoomScale = getZoomScale(root.features, multipleChina.panleObj.width, multipleChina.panleObj.height);
			var projection = d3.geo.mercator()
				.center([10, 48])
				.scale(zoomScale*44)
				.translate([multipleChina.panleObj.width/5, multipleChina.panleObj.height/2]);
			path = d3.geo.path().projection(projection);
		}else if(multipleChina.typeChart=="multiplemap"){
			var zoomScale = getZoomScale(root.features, multipleChina.panleObj.width, multipleChina.panleObj.height);
			var projection = d3.geo.mercator()
				.center([107, 38])
				.scale(zoomScale*43)
				.translate([multipleChina.panleObj.width/5, multipleChina.panleObj.height/2]);
			path = d3.geo.path().projection(projection);
		}
		multipleChina.svg.selectAll(".chinaPath"+multipleChina.randNum)
			.data(function(){
				if(multipleChina.typeChart=="multiplemap"){
					return root.features;
				}else if(multipleChina.typeChart=="multipleworld"){
					var features = _.filter(root.features, function(value) {
						return value.properties.name != '南极洲';
					});
					return features;
				}
			})
			.enter()
			.append("path")
			.attr("class", "chinaPath"+multipleChina.randNum)
			.attr("stroke","#000")
			.attr("stroke-width", 0.3)
			.attr("fill", function(d){return colorInfo(d,nodesSum,maxvalue,minvalue,multipleChina.clickNum)})
			.attr("d", path )
			.on("mousedown", d3.behavior.zoom())
			.on("mouseover", function (d) {
				backColor = d3.select(this).attr("fill");
				var overColor = "#FFB980";
				d3.select(this)
					.attr("fill", overColor)
				multipleChina.tip.html(titleInfo(d,nodesSum,multipleChina.clickNum));
				multipleChina.tip.show();
			})
			.on("mouseout",function(){
				d3.select(this)
					.attr("fill",function(d){return colorInfo(d,nodesSum,maxvalue,minvalue,multipleChina.clickNum)});
				multipleChina.tip.hide();
			});
		//get center coordinate
		root.features.forEach(function(d, i) {
			var centroid = path.centroid(d);
			centroid.x = centroid[0];
			centroid.y = centroid[1];
			centroid.id = d.properties.id;
			centroid.name = d.properties.name;
			centroid.feature = d;
			nodes.push(centroid);
		});
	});
}
//multiple china map axis dynamic state show
var clickAxis = function (args){
	var lengthNum = args.vauleCnt.length,
		r = 4;
	d3.selectAll(".circle"+args.randNum)
		.attr("r", r)
		.style("stroke", function() {return "#63B8FF";})
		.style("fill", function() {return "#ffffff";})
		.style("stroke-width", 1);
	if(args.circleObj != "undefined") {
		var circle = d3.select(args.circleObj);
		circle.transition()
			.duration(300)
			.attr("r", function(){return r+2})
			.style("stroke-width", 5);
	}
	args.clickNum=[];
	for(var a=0;a<lengthNum;a++){
		if(args.circle_id==args.vauleCnt[a]){
			args.clickNum.push(a);}
	}
	var svgChina=d3.selectAll(".chinaPath"+args.randNum)
	var nodesSum=d3.entries(args.dataSum);
	var dataFill=[],lengthNum = [];
	nodesSum.forEach(function(s){
		if(typeof s.value === 'object' && !isNaN(s.value.length)) {
			dataFill.push(s.value);
		}
	})
	dataFill.forEach(function(d){
		lengthNum.push(d.length);
	})
	var lengthArray = d3.max(lengthNum);
	var doubleData = [],maxvalue = [],minvalue = [];
	for(var b=0;b<lengthArray;b++){
		doubleData[b]=[];
	}
	dataFill.forEach(function(d){
		for(var e=0;e< d.length;e++){
			doubleData[e].push(d[e].arithmetic);
		}
	})
	doubleData.forEach(function(d){
		maxvalue.push(d3.max(d));
		minvalue.push(d3.min(d));
	})
	for(var b = 0;b<maxvalue.length;b++){
		if(maxvalue[b]==minvalue[b]){
			minvalue[b]=[0];
		}
	}
	var backColor;
	svgChina.transition()
		.duration(300)
		.attr("fill",function(d){
			return colorInfo(d,nodesSum,maxvalue,minvalue,args.clickNum);
		})
	svgChina.on("mouseover",function(d){
		var overColor = "#FFB980";
		backColor = d3.select(this).attr("fill");
		d3.select(this)
			.attr("fill",overColor)
		args.tip.html(titleInfo(d,nodesSum,args.clickNum))
		args.tip.show();
	})
		.on("mouseout",function(){
			d3.select(this)
				.attr("fill",function(d){
					return colorInfo(d,nodesSum,maxvalue,minvalue,args.clickNum)});
			args.tip.hide();
		})
}
//tips information
var titleInfo = function(d,nodesSum,clickNum){
	var nameNode=d.properties.name;
	var nodemap=[];
	nodesSum.forEach(function(n){
		if(n.key==nameNode){
			if(typeof n.value === 'object' && !isNaN(n.value.length)){
				nodemap.push(n.value[clickNum].tipStr);
			}
		}
	})
	if(nodemap==null||nodemap==""){
		nodemap=0;
	}
	return nameNode+" : "+nodemap;
}
//map color fill
var colorInfo = function(d,nodesSum,maxvalue,minvalue,clickNum){
	var nameNode=d.properties.name;
	var dataValue=[];
	nodesSum.forEach(function(m){
		if(m.key==nameNode){
			if(typeof m.value === 'object' && !isNaN(m.value.length)){
				dataValue.push(m.value[clickNum].arithmetic);
			}
		}
	})
	var linear = d3.scale.linear()
		.domain([minvalue[clickNum], maxvalue[clickNum]])
		.range([0, 1]);
	var a = d3.rgb(223,254,255);//low
	var b = d3.rgb(50,143,229);//high
	var computeColor = d3.interpolate(a,b);
	var t = linear(dataValue);
	var color = computeColor(t);
	if(dataValue<0){
		color = "#FF4500";
	}
	if(dataValue=="undefined"||dataValue==null||dataValue==""||dataValue==0){
		color = "#E0FFFF";
	}
	return color.toString();
}
//array sort function
var compare = function (value1, value2) {
	if (value1 < value2) {
		return 1;
	} else if (value1 > value2) {
		return -1;
	} else {
		return 0;
	}
}
//scatter map draw
var drawScatterChina = function(argsScatter) {
	var top5Info = [],
		top5Array = [],
		dataNodes = argsScatter.data,
		contentHeader  = argsScatter.contentHeader,
		lengthCol  = argsScatter.lengthNum, //type is DETA_CELL number
		countryPath = "/xdatainsight/content/saiku-ui/js/saiku/plugins/fine_Chart/mapdata/citycoordinates.json";
	var tip = d3.behavior.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0]);
	argsScatter.svg.call(tip);
	d3.json(argsScatter.mapPath, function (error, root) {
		if (error)
			return console.error(error);
		var zoomScale = getZoomScale(root.features, argsScatter.options.width, argsScatter.options.height);
		var projection = d3.geo.mercator()
			.center([107, 38])
			.scale(zoomScale * 43)
			.translate([argsScatter.options.width / 5, argsScatter.options.height / 2]);
		var path = d3.geo.path().projection(projection);
		argsScatter.svg.selectAll(".chinaPathScatter")
			.data(root.features).enter()
			.append("path")
			.attr("class", "chinaPathScatter")
			.attr("stroke", "#000")
			.attr("stroke-width", 0.3)
			.attr("stroke-dasharray", "5,5")
			.attr("fill", function () {
				var overColor = "#F1F1F1";
				return overColor;
			})
			.attr("d", path)
		var maxArray = [],
			minArray = [],
			titleLoc = 0,
			vauleData = [],
			maxColor1 = d3.rgb(84,164,182),//value is gt 0
			minColor1 = d3.rgb(164,182,113),
			maxColor = d3.rgb(164,182,113),
			minColor = d3.rgb(220,102,85);
		for(var p=0;p<lengthCol;p++){
			vauleData[p]=[];
		}
		titleLoc = dataNodes[0].length - lengthCol;
		dataNodes.forEach(function(j){
			var y = 0;
			for(var c=titleLoc;c<j.length;c++){
				vauleData[y].push(j[c].v);
				y++;
			}
		})
		vauleData.forEach(function(g){
			maxArray.push(d3.max(g));
			minArray.push(d3.min(g));
		})
		var sortArray=vauleData[0].sort(compare);
		for(var o = 0;o<5;o++){
			top5Array.push(sortArray[o]);
		}
		dataNodes.forEach(function(d){
			for(var s=0;s< d.length;s++){
				if(d[s]==null){
					d[s]=d[s-1];
				}
			}
		})
		d3.json(countryPath, function (error, root) {
			if (error)
				return console.error(error);
			if(lengthCol<=1){
				var minValue=minArray[0],
					maxValue=maxArray[0];
			}else if(lengthCol>1){
				var minValue=minArray[0],
					maxValue=maxArray[0],
					paraRange = d3.scale.linear()
						.domain([minArray[1],maxArray[1]])
						.range([0,1]);
			}
			//value is gt 0
			var paraNumber = d3.scale.linear()
				.domain([minValue,maxValue])
				.range([0,1]);
			root.coordinates.forEach(function (d) {
				var proLocation = projection(d.cp);
				dataNodes.forEach(function (g) {
					var titleLoc = g.length - lengthCol;
					if (d.name == g[titleLoc-1]) {
						if(lengthCol<=1){
							if(g[titleLoc].v>0){
								//size change
								var computeVaule = d3.interpolate(2,10);
								var t = paraNumber(g[titleLoc].v);
								var dataVaule = computeVaule(t);
								//color change
								var computeColor1 = d3.interpolate(minColor1,maxColor1);
								var w = paraNumber(g[titleLoc].v);
								var vauleColor = computeColor1(w);
							}else{
								var dataVaule = 4;
								var computeColor1 = d3.interpolate(minColor,maxColor);
								var w = paraNumber(g[titleLoc].v);
								var vauleColor = computeColor1(w);
							}
						}else if(lengthCol>=2){
							//size change
							if(g[titleLoc].v>0){
								var computeVaule = d3.interpolate(2,10);
								var t = paraNumber(g[titleLoc].v);
								var dataVaule = computeVaule(t);
							}else{
								var dataVaule = 4;
							}
							//color change
							if(g[titleLoc+1].v>0){
								var computeColor1 = d3.interpolate(minColor1,maxColor1);
								var w = paraRange(g[titleLoc+1].v);
								var vauleColor = computeColor1(w);
							}else{
								var computeColor1 = d3.interpolate(minColor,maxColor);
								var w = paraRange(g[titleLoc+1].v);
								var vauleColor = computeColor1(w);
							}
						}
						top5Array.forEach(function(t){
							if(g[titleLoc].v==t){
								var top5Obj = {
									dataInfo:g,
									titleLoc:titleLoc,
									location:[proLocation[0],proLocation[1]],
									dataVaule:dataVaule
								}
								top5Info.push(top5Obj);
							}
						})
						argsScatter.svg.append("circle")
							.attr({
								"class": "scatterCity",
								"cx": proLocation[0],
								"cy": proLocation[1],
								"r": 0,
								"position":"relative",
								"z-index":"100",
								"fill": vauleColor})
							.on("mouseover",function(){
								d3.select(this)
									.attr("stroke","#000")
								var tipsName = g[titleLoc-1],
									tipsArray = [],
									tipsData = [];
								for(var k =titleLoc;k< g.length;k++){
									tipsData.push(g[k].f);
								}
								tip.html(function(){
									for(var t = 0;t<contentHeader.length;t++){
										var saveHeader = [],
											headerStr = [];
										saveHeader.push(contentHeader[t]);
										saveHeader.push(tipsData[t]);
										headerStr = saveHeader.join(" : ");
										tipsArray.push(headerStr);
									}
									return tipsName+" :</br>"+tipsArray.join("</br>");
								});
								tip.show();
							})
							.on("mouseout",function(){
								d3.select(this)
									.attr("stroke",vauleColor)
								tip.hide();
							})
							.transition()
							.duration(1000)
							.attr("r", dataVaule);
					}
				})
			})
		})
		setInterval(function(){
			argsScatter.svg.selectAll("g").remove();
			var svgCircle = argsScatter.svg.selectAll(".threeCircle")
				.data(top5Info)
				.enter().append("g")
				.attr("transform", function(d){
					return "translate("+d.location[0]+","+d.location[1]+")"
				});
			svgCircle.selectAll(".circleLine")
				.data([1,2,3])
				.enter().append("circle")
				.attr({
					"class": "circleLine",
					"r": function(){
						var d = this.parentElement.__data__
						return d.dataVaule
					}
				})
				.style({
					"fill":"rgba(255,255,255,0)",
					"stroke":"#50A3BA",
					"stroke-width":2.5,
					"position":"relative",
					"opacity":0.7
				})
				.on("mouseover",function(){
					var d = this.parentElement.__data__;
					var tipsName = d.dataInfo[titleLoc-1],
						tipsArray = [],
						tipsData = [];
					for(var k =titleLoc;k< d.dataInfo.length;k++){
						tipsData.push(d.dataInfo[k].f);
					}
					tip.html(function(){
						for(var t = 0;t<contentHeader.length;t++){
							var saveHeader = [],
								headerStr = [];
							saveHeader.push(contentHeader[t]);
							saveHeader.push(tipsData[t]);
							headerStr = saveHeader.join(" : ");
							tipsArray.push(headerStr);
						}
						return tipsName+" :</br>"+tipsArray.join("</br>");
					});
					tip.show();
				})
				.on("mouseout",function(){
					tip.hide();
				})
				.transition()
				.duration(function(d){
					return d*2000;
				})
				.delay(0)
				.attr({
					"r":function(){return this.parentElement.__data__.dataVaule+20}
				})
				.style("stroke-width",0)
				.remove();

		},3000)
		colorRange(argsScatter.svg,minColor,maxColor1,argsScatter.options,maxArray[1],minArray[1],contentHeader);
		var argsSize = {
			svg:argsScatter.svg,
			contentHeader:contentHeader,
			options:argsScatter.options
		}
		sizeRange(argsSize)
	})
}

var sizeRange = function(argsSize){
	var circleData = [7,6,5,4,3]
	argsSize.svg.selectAll(".nodeCircle")
		.data(circleData)
		.enter().append("circle")
		.attr({
			"class":"nodeCircle",
			"cx":argsSize.options.width*0.65,
			"cy":function(d){return argsSize.options.height*0.75-d*20;},
			"r":function(d){return d;},
			"fill":"white",
			"stroke":"#1C5896"
		})
	if(argsSize.contentHeader){
		var ValueText = argsSize.svg.append("text")
			.attr("class","sizeText")
			.attr({
				"x": argsSize.options.width*0.65-5,
		        "y": argsSize.options.height*0.75-circleData[0]*20-20,
				"text-anchor":"middle"
			})
			.text(function(){
				return argsSize.contentHeader[0];
			});
	}
	var maxValueText = argsSize.svg.append("text")
		.attr("class","sizeText")
		.attr({
			"x": argsSize.options.width*0.65-50,
			"y": argsSize.options.height*0.75 - circleData[0]*20
		})
		.text("Large")
	//.text(function(){
	//return minvalue[0];
	//});
	var minValueText = argsSize.svg.append("text")
		.attr("class","sizeText")
		.attr("x", argsSize.options.width*0.65-50)
		.attr("y", argsSize.options.height*0.75 - circleData[4]*20 +5)
		.text("Small")
	//.text(function(){
	//	return maxvalue[0];
	//});
}
//color range
var colorRange = function(svg,a,b,options,maxvalue,minvalue,contentHeader){
	var defs = svg.append("defs");
	var linearGradient = defs.append("linearGradient")
		.attr("id","linearColor")
		.attr("x1","0%")
		.attr("y1","0%")
		.attr("x2","0%")
		.attr("y2","100%");

	var stop1 = linearGradient.append("stop")
		.attr("offset","0%")
		.style("stop-color",b.toString());

	var stop2 = linearGradient.append("stop")
		.attr("offset","100%")
		.style("stop-color",a.toString());
	var colorLength = 150;
	var colorWidth = 20;
	var colorRect = svg.append("rect")
		.attr("x", options.width*0.65-7)
		.attr("y", options.height*0.75)
		.attr("width", colorWidth)
		.attr("height", colorLength)
		.style("fill","url(#" + linearGradient.attr("id") + ")");

	//add words
	if(contentHeader){
		var ValueText = svg.append("text")
			.attr({
				"class":"valueText",
				"x": options.width*0.65+5,
				"y": options.height*0.75-10,
				"text-anchor":"middle"
			})
			.text(function(){
				if(contentHeader[1]){
					var contentTitle = contentHeader[1];
				}else{
					var contentTitle = contentHeader[0];
				}
				return contentTitle;
			});
	}
	var minValueText = svg.append("text")
		.attr("class","valueText")
		.attr("x", options.width*0.65-40)
		.attr("y", options.height*0.75+10)
		.text("High")
	//.text(function(){
	//return minvalue[0];
	//});

	var maxValueText = svg.append("text")
		.attr("class","valueText")
		.attr("x", options.width*0.65-40)
		.attr("y", options.height*0.75+colorLength)
		.text("Low")
	//.text(function(){
	//	return maxvalue[0];
	//});
}
//tips of force,treeslink and sunburst data
var dataTips = function(dataMy,headerCnt){
	var dataNodes = [];
	dataMy.forEach(function(d){
		for(var s=0;s< d.length;s++){
			if(d[s]==null){
				d[s]=d[s-1];
			}
		}
	})
	dataMy.forEach(function(d){
		var titleLoc = d.length - headerCnt.length,
			dataFloat = [];
		for(var a = titleLoc;a<d.length;a++){
			dataFloat.push(d[a].f);
		}
		var dataObj = {
			nodeName: d[titleLoc-1],
			nodeValue: d[titleLoc].v,
			valueFloat:dataFloat
		}
		dataNodes.push(dataObj);
	})
	return dataNodes;
}
//tips of force,treeslink and sunburst information
var textContent = function(d,dataNodes,headerCnt){
	var tipsArray = null;
	for(var c=0;c<dataNodes.length;c++){
		if(d.nodeName == dataNodes[c].nodeName){
			tipsArray = [];
			for(var w = 0;w< dataNodes[c].valueFloat.length;w++){
				var transferHeader = [],
					headerStr = [];
				transferHeader.push(headerCnt[w]);
				transferHeader.push(dataNodes[c].valueFloat[w]);
				headerStr = transferHeader.join(" : ");
				tipsArray.push(headerStr);
			}
		}
	}
	if(tipsArray == null){
		return (d.nodeName);
	}else{
		return (d.nodeName+":</br>"+tipsArray.join("</br>"));
	}

}
// multiple color range
var colorMultiple = function(svg,colorParam,options,maxvalue,minvalue,contentHeader){
	var defs = svg.append("defs");
	var linearGradient = defs.append("linearGradient")
		.attr("id","linearColor")
		.attr("x1","0%")
		.attr("y1","0%")
		.attr("x2","0%")
		.attr("y2","100%");

	var stop1 = linearGradient.append("stop")
		.attr("offset","0%")
		.style("stop-color",colorParam.f.toString());
	var stop2 = linearGradient.append("stop")
		.attr("offset","20%")
		.style("stop-color",colorParam.e.toString());
	var stop3 = linearGradient.append("stop")
		.attr("offset","40%")
		.style("stop-color",colorParam.d.toString());
	var stop4 = linearGradient.append("stop")
		.attr("offset","60%")
		.style("stop-color",colorParam.c.toString());
	var stop5 = linearGradient.append("stop")
		.attr("offset","80%")
		.style("stop-color",colorParam.b.toString());
	var stop5 = linearGradient.append("stop")
		.attr("offset","100%")
		.style("stop-color",colorParam.a.toString());

	var colorLength = 180;
	var colorWidth = 20;
	var colorRect = svg.append("rect")
		.attr("x", options.width*0.65-7)
		.attr("y", options.height*0.75)
		.attr("width", colorWidth)
		.attr("height", colorLength)
		.style("fill","url(#" + linearGradient.attr("id") + ")");

	//add words
	if(contentHeader){
		var ValueText = svg.append("text")
			.attr({
				"class":"valueText",
				"x": options.width*0.65+5,
				"y": options.height*0.75-10,
				"text-anchor":"middle"
			})
			.text(function(){
				if(contentHeader[1]){
					var contentTitle = contentHeader[1];
				}else{
					var contentTitle = contentHeader[0];
				}
				return contentTitle;
			});
	}
	var minValueText = svg.append("text")
		.attr("class","valueText")
		.attr("x", options.width*0.65-40)
		.attr("y", options.height*0.75+10)
		.text("High")
	//.text(function(){
	//return minvalue[0];
	//});

	var maxValueText = svg.append("text")
		.attr("class","valueText")
		.attr("x", options.width*0.65-40)
		.attr("y", options.height*0.75+colorLength)
		.text("Low")
	//.text(function(){
	//	return maxvalue[0];
	//});
}

d3.behavior.tip = function() {
    var direction = d3_tip_direction,
        offset = d3_tip_offset,
        html = d3_tip_html,
        node = initNode(),
        svg = null,
        point = null,
        target = null;

    function tip(vis) {
        svg = getSVGNode(vis);
        point = svg.createSVGPoint();
        document.body.appendChild(node);
    }
    // Public - show the tooltip on the screen
    // Returns a tip
    tip.show = function() {
        var args = Array.prototype.slice.call(arguments);
        if (args[args.length - 1] instanceof SVGElement) target = args.pop();

        var content = html.apply(this, args),
            poffset = offset.apply(this, args),
            dir = direction.apply(this, args),
            nodel = d3.select(node), i = 0,
            coords;

        nodel.html(content)
            .style({
                'opacity': 1,
                'pointer-events': 'all',
                'line-height': '16px',
                'text-align':'left'
            });

        while (i--) nodel.classed(directions[i], false);
        coords = direction_callbacks.get(dir).apply(this);
        nodel.classed(dir, true).style({
            top: (coords.top + poffset[0]) + 'px',
            left: (coords.left + poffset[1]) + 'px'
        });
        return tip;
    };
    // Returns a tip
    tip.hide = function() {
        var nodel = d3.select(node);

        nodel.style({ opacity: 0, 'pointer-events': 'none' });
        return tip;
    };

    // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
    // n - name of the attribute
    // v - value of the attribute
    // Returns tip or attribute value
    tip.attr = function(n, v) {
        if (arguments.length < 2 && typeof n === 'string') {
            return d3.select(node).attr(n);
        }
        else {
            var args = Array.prototype.slice.call(arguments);
            d3.selection.prototype.attr.apply(d3.select(node), args);
        }

        return tip;
    };

    // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
    // n - name of the property
    // v - value of the property
    // Returns tip or style property value
    tip.style = function(n, v) {
        if (arguments.length < 2 && typeof n === 'string') {
            return d3.select(node).style(n);
        } else {
            var args = Array.prototype.slice.call(arguments);

            d3.selection.prototype.style.apply(d3.select(node), args);
        }

        return tip;
    };

    // Public: Set or get the direction of the tooltip
    // v - One of n(north),  s(south),  e(east),  or w(west),  nw(northwest),
    //     sw(southwest),  ne(northeast) or se(southeast)
    // Returns tip or direction
    tip.direction = function(v) {
        if (!arguments.length) return direction;
        direction = v === null ? v : d3.functor(v);

        return tip;
    };

    // Public: Sets or gets the offset of the tip
    // v - Array of [x,  y] offset
    // Returns offset or
    tip.offset = function(v) {
        if (!arguments.length) return offset;
        offset = v === null ? v : d3.functor(v);

        return tip;
    };
    // Public: sets or gets the html value of the tooltip
    // v - String value of the tip
    // Returns html value or tip
    tip.html = function(v) {
        if (!arguments.length) return html;
        html = v === null ? v : d3.functor(v);

        return tip;
    };
    function d3_tip_direction() {
        return 'n';
    };
    function d3_tip_offset() {
        return [0, 0];
    };
    function d3_tip_html() {
        return ' ';
    };
    var direction_callbacks = d3.map({
            n: direction_n,
            s: direction_s,
            e: direction_e,
            w: direction_w,
            nw: direction_nw,
            ne: direction_ne,
            sw: direction_sw,
            se: direction_se
        }),
        directions = direction_callbacks.keys();

    function direction_n() {
        var bbox = getScreenBBox();

        return {
            top: bbox.n.y - node.offsetHeight,
            left: bbox.n.x - node.offsetWidth / 2
        };
    };

    function direction_s() {
        var bbox = getScreenBBox();

        return {
            top: bbox.s.y,
            left: bbox.s.x - node.offsetWidth / 2
        };
    };

    function direction_e() {
        var bbox = getScreenBBox();

        return {
            top: bbox.e.y - node.offsetHeight / 2,
            left: bbox.e.x
        };
    }

    function direction_w() {
        var bbox = getScreenBBox();

        return {
            top: bbox.w.y - node.offsetHeight / 2,
            left: bbox.w.x - node.offsetWidth
        };
    };

    function direction_nw() {
        var bbox = getScreenBBox();

        return {
            top: bbox.nw.y - node.offsetHeight,
            left: bbox.nw.x - node.offsetWidth
        };
    }

    function direction_ne() {
        var bbox = getScreenBBox();

        return {
            top: bbox.ne.y - node.offsetHeight,
            left: bbox.ne.x
        };
    }

    function direction_sw() {
        var bbox = getScreenBBox();

        return {
            top: bbox.sw.y,
            left: bbox.sw.x - node.offsetWidth
        };
    }

    function direction_se() {
        var bbox = getScreenBBox();

        return {
            top: bbox.se.y,
            left: bbox.e.x
        };
    }

    function initNode() {
        var node = d3.select(document.createElement('div'));

        node.style({
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            boxSizing: 'border-box'
        });
        return node.node();
    }

    function getSVGNode(el) {
        el = el.node();
        if (el.tagName.toLowerCase() === 'svg') {
            return el;
        }
        return el.ownerSVGElement;
    }

    //  Private - gets the screen coordinates of a shape
    //  Given a shape on the screen,  will return an SVGPoint for the directions
    //  n(north),  s(south),  e(east),  w(west),  ne(northeast),  se(southeast),  nw(northwest),
    //  sw(southwest).
    //  Returns an Object {n,  s,  e,  w,  nw,  sw,  ne,  se}
    function getScreenBBox() {
        var targetel = target || d3.event.target,
            bbox = {},
            matrix = targetel.getScreenCTM(),
            tbbox = targetel.getBBox(),
            width = tbbox.width,
            height = tbbox.height,
            x = tbbox.x,
            y = tbbox.y,
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        point.x = x + scrollLeft;
        point.y = y + scrollTop;
        bbox.nw = point.matrixTransform(matrix);
        point.x += width;
        bbox.ne = point.matrixTransform(matrix);
        point.y += height;
        bbox.se = point.matrixTransform(matrix);
        point.x -= width;
        bbox.sw = point.matrixTransform(matrix);
        point.y -= height / 2;
        bbox.w = point.matrixTransform(matrix);
        point.x += width;
        bbox.e = point.matrixTransform(matrix);
        point.x -= width / 2;
        point.y -= height / 2;
        bbox.n = point.matrixTransform(matrix);
        point.y += height;
        bbox.s = point.matrixTransform(matrix);

        return bbox;
    }
    return tip;
};

var testdata = {"cellset":[[{"value":"省","type":"ROW_HEADER_HEADER","properties":{"hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"城市","type":"ROW_HEADER_HEADER","properties":{"hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"区县","type":"ROW_HEADER_HEADER","properties":{"hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"销售额","type":"COLUMN_HEADER","properties":{"uniquename":"[Measures].[销售额]","hierarchy":"[Measures]","dimension":"Measures","level":"[Measures].[MeasuresLevel]"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"646,760.16","type":"DATA_CELL","properties":{"position":"0:0","raw":"646760.163"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"三岔子","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[三岔子]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"3,262.98","type":"DATA_CELL","properties":{"position":"0:1","raw":"3262.98"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"吉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"100,773.45","type":"DATA_CELL","properties":{"position":"0:2","raw":"100773.449"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"吉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"桦甸市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市].[桦甸市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,513.22","type":"DATA_CELL","properties":{"position":"0:3","raw":"13513.22"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"吉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"磐石市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市].[磐石市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"15,359.26","type":"DATA_CELL","properties":{"position":"0:4","raw":"15359.26"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"吉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"舒兰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市].[舒兰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,983.34","type":"DATA_CELL","properties":{"position":"0:5","raw":"6983.34"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"吉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"蛟河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[吉林市].[蛟河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,419.80","type":"DATA_CELL","properties":{"position":"0:6","raw":"18419.8"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"四平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[四平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"64,339.72","type":"DATA_CELL","properties":{"position":"0:7","raw":"64339.716"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"四平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[四平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"公主岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[四平市].[公主岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"21,210.76","type":"DATA_CELL","properties":{"position":"0:8","raw":"21210.756"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"四平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[四平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"梨树县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[四平市].[梨树县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,418.74","type":"DATA_CELL","properties":{"position":"0:9","raw":"14418.74"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"71,313.39","type":"DATA_CELL","properties":{"position":"0:10","raw":"71313.389"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"和龙市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[和龙市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,508.80","type":"DATA_CELL","properties":{"position":"0:11","raw":"2508.8"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"图们市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[图们市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,932.68","type":"DATA_CELL","properties":{"position":"0:12","raw":"7932.68"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"延吉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[延吉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"26,406.80","type":"DATA_CELL","properties":{"position":"0:13","raw":"26406.8"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"敦化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[敦化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"23,641.22","type":"DATA_CELL","properties":{"position":"0:14","raw":"23641.219"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"汪清县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[汪清县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,148.21","type":"DATA_CELL","properties":{"position":"0:15","raw":"8148.21"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"珲春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[珲春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,320.64","type":"DATA_CELL","properties":{"position":"0:16","raw":"2320.64"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"延边朝鲜族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙井市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[延边朝鲜族自治州].[龙井市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"355.04","type":"DATA_CELL","properties":{"position":"0:17","raw":"355.04"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"松原市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[松原市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,135.48","type":"DATA_CELL","properties":{"position":"0:18","raw":"19135.48"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"松原市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[松原市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"前郭尔罗斯蒙古族自治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[松原市].[前郭尔罗斯蒙古族自治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,903.76","type":"DATA_CELL","properties":{"position":"0:19","raw":"3903.76"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"松原市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[松原市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"扶余县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[松原市].[扶余县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"15,231.72","type":"DATA_CELL","properties":{"position":"0:20","raw":"15231.72"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟筒山","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[烟筒山]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"791.56","type":"DATA_CELL","properties":{"position":"0:21","raw":"791.56"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"35,976.02","type":"DATA_CELL","properties":{"position":"0:22","raw":"35976.024"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"洮南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白城市].[洮南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"23,688.64","type":"DATA_CELL","properties":{"position":"0:23","raw":"23688.644"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"镇赉县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白城市].[镇赉县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,040.68","type":"DATA_CELL","properties":{"position":"0:24","raw":"4040.68"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"49,814.52","type":"DATA_CELL","properties":{"position":"0:25","raw":"49814.52"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"临江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白山市].[临江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"36,496.74","type":"DATA_CELL","properties":{"position":"0:26","raw":"36496.74"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"抚松县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[白山市].[抚松县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,399.90","type":"DATA_CELL","properties":{"position":"0:27","raw":"3399.9"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"辽源市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[辽源市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"27,602.20","type":"DATA_CELL","properties":{"position":"0:28","raw":"27602.204"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"辽源市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[辽源市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东丰县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[辽源市].[东丰县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,785.84","type":"DATA_CELL","properties":{"position":"0:29","raw":"1785.84"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"通化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[通化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,407.18","type":"DATA_CELL","properties":{"position":"0:30","raw":"10407.18"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"通化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[通化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"梅河口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[通化市].[梅河口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,346.90","type":"DATA_CELL","properties":{"position":"0:31","raw":"6346.9"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"通化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[通化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"辉南县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[通化市].[辉南县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,060.28","type":"DATA_CELL","properties":{"position":"0:32","raw":"4060.28"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"郑家屯","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[郑家屯]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"839.44","type":"DATA_CELL","properties":{"position":"0:33","raw":"839.44"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"262,504.22","type":"DATA_CELL","properties":{"position":"0:34","raw":"262504.221"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"九台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市].[九台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"32,535.94","type":"DATA_CELL","properties":{"position":"0:35","raw":"32535.944"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"二道区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市].[二道区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,461.24","type":"DATA_CELL","properties":{"position":"0:36","raw":"4461.24"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"双阳区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市].[双阳区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,786.60","type":"DATA_CELL","properties":{"position":"0:37","raw":"4786.6"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"德惠市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市].[德惠市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,381.82","type":"DATA_CELL","properties":{"position":"0:38","raw":"9381.82"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"朝阳区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市].[朝阳区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"26,595.07","type":"DATA_CELL","properties":{"position":"0:39","raw":"26595.072"}}],[{"value":"吉林省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"榆树市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[吉林省].[长春市].[榆树市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,942.26","type":"DATA_CELL","properties":{"position":"0:40","raw":"3942.26"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"835,015.05","type":"DATA_CELL","properties":{"position":"0:41","raw":"835015.048"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"丹东市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[丹东市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"76,858.68","type":"DATA_CELL","properties":{"position":"0:42","raw":"76858.684"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"丹东市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[丹东市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"凤城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[丹东市].[凤城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"20,989.16","type":"DATA_CELL","properties":{"position":"0:43","raw":"20989.164"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"丹东市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[丹东市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宽甸满族自治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[丹东市].[宽甸满族自治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,421.91","type":"DATA_CELL","properties":{"position":"0:44","raw":"10421.908"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"叶柏寿","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[叶柏寿]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,199.72","type":"DATA_CELL","properties":{"position":"0:45","raw":"1199.716"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大连市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"107,266.24","type":"DATA_CELL","properties":{"position":"0:46","raw":"107266.236"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大连市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"庄河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市].[庄河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,492.51","type":"DATA_CELL","properties":{"position":"0:47","raw":"5492.508"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大连市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"普兰店市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市].[普兰店市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"779.10","type":"DATA_CELL","properties":{"position":"0:48","raw":"779.1"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大连市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"瓦房店市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[大连市].[瓦房店市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,349.33","type":"DATA_CELL","properties":{"position":"0:49","raw":"3349.332"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"抚顺市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[抚顺市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"93,237.82","type":"DATA_CELL","properties":{"position":"0:50","raw":"93237.816"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"抚顺市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[抚顺市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"抚顺县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[抚顺市].[抚顺县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"93,237.82","type":"DATA_CELL","properties":{"position":"0:51","raw":"93237.816"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"朝阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"44,912.76","type":"DATA_CELL","properties":{"position":"0:52","raw":"44912.756"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"朝阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"凌源市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市].[凌源市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,950.60","type":"DATA_CELL","properties":{"position":"0:53","raw":"11950.596"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"朝阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"北票市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市].[北票市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,948.16","type":"DATA_CELL","properties":{"position":"0:54","raw":"7948.164"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"朝阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"朝阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[朝阳市].[朝阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"25,014.00","type":"DATA_CELL","properties":{"position":"0:55","raw":"25013.996"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"本溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[本溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"73,751.05","type":"DATA_CELL","properties":{"position":"0:56","raw":"73751.048"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"本溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[本溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"本溪满族自治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[本溪市].[本溪满族自治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"54,864.91","type":"DATA_CELL","properties":{"position":"0:57","raw":"54864.908"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"本溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[本溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"桓仁满族自治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[本溪市].[桓仁满族自治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,886.14","type":"DATA_CELL","properties":{"position":"0:58","raw":"18886.14"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"沈阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"244,320.22","type":"DATA_CELL","properties":{"position":"0:59","raw":"244320.216"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"沈阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新民市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市].[新民市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,037.17","type":"DATA_CELL","properties":{"position":"0:60","raw":"2037.168"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"沈阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"苏家屯区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市].[苏家屯区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"846.47","type":"DATA_CELL","properties":{"position":"0:61","raw":"846.468"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"沈阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"辽中县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[沈阳市].[辽中县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,187.78","type":"DATA_CELL","properties":{"position":"0:62","raw":"2187.78"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"营口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[营口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"35,703.53","type":"DATA_CELL","properties":{"position":"0:63","raw":"35703.528"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"葫芦岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[葫芦岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,292.90","type":"DATA_CELL","properties":{"position":"0:64","raw":"8292.9"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"葫芦岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[葫芦岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"兴城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[葫芦岛市].[兴城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,233.03","type":"DATA_CELL","properties":{"position":"0:65","raw":"5233.032"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"葫芦岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[葫芦岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"南票区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[葫芦岛市].[南票区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,059.87","type":"DATA_CELL","properties":{"position":"0:66","raw":"3059.868"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"辽阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[辽阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"26,110.90","type":"DATA_CELL","properties":{"position":"0:67","raw":"26110.896"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"辽阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[辽阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"辽阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[辽阳市].[辽阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"26,110.90","type":"DATA_CELL","properties":{"position":"0:68","raw":"26110.896"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铁岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"56,085.71","type":"DATA_CELL","properties":{"position":"0:69","raw":"56085.708"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铁岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"开原市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市].[开原市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,605.18","type":"DATA_CELL","properties":{"position":"0:70","raw":"5605.18"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铁岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"昌图县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市].[昌图县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,145.33","type":"DATA_CELL","properties":{"position":"0:71","raw":"9145.332"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铁岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"西丰县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市].[西丰县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,696.60","type":"DATA_CELL","properties":{"position":"0:72","raw":"12696.6"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铁岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"铁岭县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[铁岭市].[铁岭县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"28,638.60","type":"DATA_CELL","properties":{"position":"0:73","raw":"28638.596"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"锦州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[锦州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"819.84","type":"DATA_CELL","properties":{"position":"0:74","raw":"819.84"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"锦州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[锦州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黑山县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[锦州市].[黑山县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"819.84","type":"DATA_CELL","properties":{"position":"0:75","raw":"819.84"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鞍山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[鞍山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"66,455.70","type":"DATA_CELL","properties":{"position":"0:76","raw":"66455.704"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鞍山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[鞍山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"岫岩满族自治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[鞍山市].[岫岩满族自治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,305.23","type":"DATA_CELL","properties":{"position":"0:77","raw":"7305.228"}}],[{"value":"辽宁省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鞍山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[鞍山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"海城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[辽宁省].[鞍山市].[海城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,087.39","type":"DATA_CELL","properties":{"position":"0:78","raw":"14087.388"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,105,281.11","type":"DATA_CELL","properties":{"position":"0:79","raw":"1105281.114"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"七台河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[七台河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"62,568.80","type":"DATA_CELL","properties":{"position":"0:80","raw":"62568.8"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"七台河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[七台河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"勃利县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[七台河市].[勃利县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,741.48","type":"DATA_CELL","properties":{"position":"0:81","raw":"9741.48"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"伊春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"74,991.58","type":"DATA_CELL","properties":{"position":"0:82","raw":"74991.581"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"伊春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"南岔区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市].[南岔区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,002.16","type":"DATA_CELL","properties":{"position":"0:83","raw":"24002.16"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"伊春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"友好区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市].[友好区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,571.80","type":"DATA_CELL","properties":{"position":"0:84","raw":"9571.8"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"伊春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新青区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市].[新青区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,009.24","type":"DATA_CELL","properties":{"position":"0:85","raw":"7009.24"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"伊春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"铁力市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[伊春市].[铁力市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"34,408.38","type":"DATA_CELL","properties":{"position":"0:86","raw":"34408.381"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"佳木斯市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[佳木斯市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"83,205.50","type":"DATA_CELL","properties":{"position":"0:87","raw":"83205.5"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"佳木斯市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[佳木斯市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"富锦市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[佳木斯市].[富锦市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,592.58","type":"DATA_CELL","properties":{"position":"0:88","raw":"12592.58"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"佳木斯市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[佳木斯市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"桦南县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[佳木斯市].[桦南县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,349.58","type":"DATA_CELL","properties":{"position":"0:89","raw":"7349.58"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"双鸭山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[双鸭山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"30,728.96","type":"DATA_CELL","properties":{"position":"0:90","raw":"30728.964"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"双鸭山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[双鸭山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宝山区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[双鸭山市].[宝山区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,980.06","type":"DATA_CELL","properties":{"position":"0:91","raw":"13980.064"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"双鸭山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[双鸭山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"岭东区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[双鸭山市].[岭东区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,353.14","type":"DATA_CELL","properties":{"position":"0:92","raw":"3353.14"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"311,716.88","type":"DATA_CELL","properties":{"position":"0:93","raw":"311716.881"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"五常市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[五常市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,771.46","type":"DATA_CELL","properties":{"position":"0:94","raw":"3771.46"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"依兰县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[依兰县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"26,874.82","type":"DATA_CELL","properties":{"position":"0:95","raw":"26874.82"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"双城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[双城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"784.84","type":"DATA_CELL","properties":{"position":"0:96","raw":"784.84"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"呼兰区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[呼兰区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,749.64","type":"DATA_CELL","properties":{"position":"0:97","raw":"18749.64"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宾州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[宾州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,749.22","type":"DATA_CELL","properties":{"position":"0:98","raw":"4749.22"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"尚志市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[尚志市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"22,192.31","type":"DATA_CELL","properties":{"position":"0:99","raw":"22192.31"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"哈尔滨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阿城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[哈尔滨市].[阿城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"28,906.36","type":"DATA_CELL","properties":{"position":"0:100","raw":"28906.36"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大兴安岭地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大兴安岭地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"724.50","type":"DATA_CELL","properties":{"position":"0:101","raw":"724.5"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大兴安岭地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大兴安岭地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"塔河县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大兴安岭地区].[塔河县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"724.50","type":"DATA_CELL","properties":{"position":"0:102","raw":"724.5"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"103,400.49","type":"DATA_CELL","properties":{"position":"0:103","raw":"103400.486"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"杜尔伯特蒙古族自治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市].[杜尔伯特蒙古族自治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,516.78","type":"DATA_CELL","properties":{"position":"0:104","raw":"2516.78"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"红岗区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市].[红岗区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,639.20","type":"DATA_CELL","properties":{"position":"0:105","raw":"5639.2"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"肇源县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市].[肇源县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"32,549.16","type":"DATA_CELL","properties":{"position":"0:106","raw":"32549.16"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"让胡路区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市].[让胡路区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,800.51","type":"DATA_CELL","properties":{"position":"0:107","raw":"1800.512"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙凤区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[大庆市].[龙凤区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,549.06","type":"DATA_CELL","properties":{"position":"0:108","raw":"2549.064"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"山河屯","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[山河屯]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,699.80","type":"DATA_CELL","properties":{"position":"0:109","raw":"4699.8"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"牡丹江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"87,025.67","type":"DATA_CELL","properties":{"position":"0:110","raw":"87025.673"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"牡丹江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东宁县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市].[东宁县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,706.20","type":"DATA_CELL","properties":{"position":"0:111","raw":"2706.2"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"牡丹江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"林口县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市].[林口县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,628.51","type":"DATA_CELL","properties":{"position":"0:112","raw":"18628.505"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"牡丹江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"海林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市].[海林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,161.34","type":"DATA_CELL","properties":{"position":"0:113","raw":"14161.336"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"牡丹江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"绥芬河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[牡丹江市].[绥芬河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,116.24","type":"DATA_CELL","properties":{"position":"0:114","raw":"2116.24"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"穆棱市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[穆棱市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"2,650.20","type":"DATA_CELL","properties":{"position":"0:115","raw":"2650.2"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"93,394.03","type":"DATA_CELL","properties":{"position":"0:116","raw":"93394.028"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"兰西县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[兰西县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"20,877.92","type":"DATA_CELL","properties":{"position":"0:117","raw":"20877.92"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"安达市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[安达市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"29,705.09","type":"DATA_CELL","properties":{"position":"0:118","raw":"29705.088"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"明水县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[明水县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,849.98","type":"DATA_CELL","properties":{"position":"0:119","raw":"2849.98"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"望奎县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[望奎县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,759.52","type":"DATA_CELL","properties":{"position":"0:120","raw":"1759.52"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"绥棱县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[绥棱县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,341.12","type":"DATA_CELL","properties":{"position":"0:121","raw":"4341.12"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"肇东市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[肇东市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,259.46","type":"DATA_CELL","properties":{"position":"0:122","raw":"2259.46"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"青冈县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[绥化市].[青冈县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,784.80","type":"DATA_CELL","properties":{"position":"0:123","raw":"5784.8"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鸡西市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"111,719.48","type":"DATA_CELL","properties":{"position":"0:124","raw":"111719.475"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鸡西市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"密山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市].[密山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,586.00","type":"DATA_CELL","properties":{"position":"0:125","raw":"24585.995"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鸡西市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"恒山区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市].[恒山区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"17,943.38","type":"DATA_CELL","properties":{"position":"0:126","raw":"17943.38"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鸡西市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"滴道区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市].[滴道区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,221.02","type":"DATA_CELL","properties":{"position":"0:127","raw":"5221.02"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鸡西市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"鸡东县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鸡西市].[鸡东县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"27,367.90","type":"DATA_CELL","properties":{"position":"0:128","raw":"27367.9"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鹤岗市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[鹤岗市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"32,579.06","type":"DATA_CELL","properties":{"position":"0:129","raw":"32579.064"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黑河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[黑河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"253.26","type":"DATA_CELL","properties":{"position":"0:130","raw":"253.26"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黑河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[黑河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"嫩江县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[黑河市].[嫩江县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"253.26","type":"DATA_CELL","properties":{"position":"0:131","raw":"253.26"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"105,622.90","type":"DATA_CELL","properties":{"position":"0:132","raw":"105622.902"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"富拉尔基区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市].[富拉尔基区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,902.13","type":"DATA_CELL","properties":{"position":"0:133","raw":"14902.125"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"拜泉县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市].[拜泉县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,225.60","type":"DATA_CELL","properties":{"position":"0:134","raw":"3225.6"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"泰来县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市].[泰来县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,247.18","type":"DATA_CELL","properties":{"position":"0:135","raw":"7247.184"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"甘南县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市].[甘南县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,041.26","type":"DATA_CELL","properties":{"position":"0:136","raw":"5041.26"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"讷河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市].[讷河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,149.64","type":"DATA_CELL","properties":{"position":"0:137","raw":"8149.638"}}],[{"value":"黑龙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"齐齐哈尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙江县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[东北].[黑龙江省].[齐齐哈尔市].[龙江县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,302.28","type":"DATA_CELL","properties":{"position":"0:138","raw":"1302.28"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,311,914.42","type":"DATA_CELL","properties":{"position":"0:139","raw":"1311914.422"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"东莞市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[东莞市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,165.89","type":"DATA_CELL","properties":{"position":"0:140","raw":"10165.89"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"云浮市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[云浮市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,351.21","type":"DATA_CELL","properties":{"position":"0:141","raw":"6351.212"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"佛山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[佛山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"7,500.39","type":"DATA_CELL","properties":{"position":"0:142","raw":"7500.388"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"广州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[广州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"274,952.81","type":"DATA_CELL","properties":{"position":"0:143","raw":"274952.811"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"广州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[广州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东山区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[广州市].[东山区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,609.52","type":"DATA_CELL","properties":{"position":"0:144","raw":"1609.524"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"广州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[广州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄埔区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[广州市].[黄埔区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"382.62","type":"DATA_CELL","properties":{"position":"0:145","raw":"382.62"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"惠州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[惠州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"54,902.76","type":"DATA_CELL","properties":{"position":"0:146","raw":"54902.757"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"惠州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[惠州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"惠城区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[惠州市].[惠城区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"32,897.48","type":"DATA_CELL","properties":{"position":"0:147","raw":"32897.48"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"揭阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[揭阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"34,590.82","type":"DATA_CELL","properties":{"position":"0:148","raw":"34590.822"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"梅州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[梅州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"23,554.64","type":"DATA_CELL","properties":{"position":"0:149","raw":"23554.636"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汕头市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[汕头市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"118,882.37","type":"DATA_CELL","properties":{"position":"0:150","raw":"118882.372"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汕头市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[汕头市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"潮阳区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[汕头市].[潮阳区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"177.80","type":"DATA_CELL","properties":{"position":"0:151","raw":"177.8"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汕尾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[汕尾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"16,560.57","type":"DATA_CELL","properties":{"position":"0:152","raw":"16560.572"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汕尾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[汕尾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"陆丰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[汕尾市].[陆丰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"619.92","type":"DATA_CELL","properties":{"position":"0:153","raw":"619.92"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"江门市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[江门市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"43,470.53","type":"DATA_CELL","properties":{"position":"0:154","raw":"43470.532"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"河源市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[河源市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"20,499.51","type":"DATA_CELL","properties":{"position":"0:155","raw":"20499.514"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"深圳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[深圳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"328,333.14","type":"DATA_CELL","properties":{"position":"0:156","raw":"328333.138"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"深圳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[深圳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"福田区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[深圳市].[福田区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"35,531.57","type":"DATA_CELL","properties":{"position":"0:157","raw":"35531.566"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"深圳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[深圳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙岗区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[深圳市].[龙岗区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,715.23","type":"DATA_CELL","properties":{"position":"0:158","raw":"2715.23"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"清远市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[清远市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"15,289.93","type":"DATA_CELL","properties":{"position":"0:159","raw":"15289.932"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湛江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"70,320.21","type":"DATA_CELL","properties":{"position":"0:160","raw":"70320.208"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湛江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"吴川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市].[吴川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,995.64","type":"DATA_CELL","properties":{"position":"0:161","raw":"8995.644"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湛江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"廉江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市].[廉江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,784.00","type":"DATA_CELL","properties":{"position":"0:162","raw":"3784.004"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湛江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"徐闻县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市].[徐闻县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,617.88","type":"DATA_CELL","properties":{"position":"0:163","raw":"3617.88"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湛江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"遂溪县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[湛江市].[遂溪县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,144.00","type":"DATA_CELL","properties":{"position":"0:164","raw":"4144.0"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潮州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[潮州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"32,391.10","type":"DATA_CELL","properties":{"position":"0:165","raw":"32391.1"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"珠海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[珠海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"53,593.69","type":"DATA_CELL","properties":{"position":"0:166","raw":"53593.694"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"肇庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[肇庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"61,848.53","type":"DATA_CELL","properties":{"position":"0:167","raw":"61848.528"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"茂名市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"16,006.70","type":"DATA_CELL","properties":{"position":"0:168","raw":"16006.704"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"茂名市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"信宜市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市].[信宜市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,771.06","type":"DATA_CELL","properties":{"position":"0:169","raw":"4771.06"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"茂名市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"化州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市].[化州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,078.94","type":"DATA_CELL","properties":{"position":"0:170","raw":"9078.944"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"茂名市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"高州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[茂名市].[高州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,156.70","type":"DATA_CELL","properties":{"position":"0:171","raw":"2156.7"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阳江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"46,369.15","type":"DATA_CELL","properties":{"position":"0:172","raw":"46369.148"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阳江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阳东县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市].[阳东县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,726.94","type":"DATA_CELL","properties":{"position":"0:173","raw":"7726.936"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阳江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阳春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市].[阳春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,670.93","type":"DATA_CELL","properties":{"position":"0:174","raw":"4670.932"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阳江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阳西县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[阳江市].[阳西县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,980.86","type":"DATA_CELL","properties":{"position":"0:175","raw":"1980.86"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"韶关市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"76,330.46","type":"DATA_CELL","properties":{"position":"0:176","raw":"76330.464"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"韶关市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"乐昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市].[乐昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,241.00","type":"DATA_CELL","properties":{"position":"0:177","raw":"3241.0"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"韶关市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"南雄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市].[南雄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"15,586.48","type":"DATA_CELL","properties":{"position":"0:178","raw":"15586.48"}}],[{"value":"广东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"韶关市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"曲江区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广东省].[韶关市].[曲江区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,041.99","type":"DATA_CELL","properties":{"position":"0:179","raw":"7041.986"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"432,065.00","type":"DATA_CELL","properties":{"position":"0:180","raw":"432065.004"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"北海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[北海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"27,896.30","type":"DATA_CELL","properties":{"position":"0:181","raw":"27896.295"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"北海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[北海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"合浦县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[北海市].[合浦县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"27,370.62","type":"DATA_CELL","properties":{"position":"0:182","raw":"27370.623"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[南宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"140,506.02","type":"DATA_CELL","properties":{"position":"0:183","raw":"140506.016"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[南宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宾阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[南宁市].[宾阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,814.42","type":"DATA_CELL","properties":{"position":"0:184","raw":"9814.42"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[南宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邕宁区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[南宁市].[邕宁区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,537.52","type":"DATA_CELL","properties":{"position":"0:185","raw":"12537.518"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南渡镇","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[南渡镇]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"23,807.56","type":"DATA_CELL","properties":{"position":"0:186","raw":"23807.56"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"崇左市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[崇左市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"17,619.49","type":"DATA_CELL","properties":{"position":"0:187","raw":"17619.49"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"崇左市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[崇左市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"大新县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[崇左市].[大新县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"17,619.49","type":"DATA_CELL","properties":{"position":"0:188","raw":"17619.49"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"来宾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[来宾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"13,756.40","type":"DATA_CELL","properties":{"position":"0:189","raw":"13756.4"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"桂林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[桂林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"73,794.00","type":"DATA_CELL","properties":{"position":"0:190","raw":"73794.0"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"梧州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[梧州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"35,242.60","type":"DATA_CELL","properties":{"position":"0:191","raw":"35242.599"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"梧州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[梧州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"苍梧县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[梧州市].[苍梧县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,724.10","type":"DATA_CELL","properties":{"position":"0:192","raw":"8724.1"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"玉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[玉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"18,595.75","type":"DATA_CELL","properties":{"position":"0:193","raw":"18595.752"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"玉林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[玉林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宾县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[玉林市].[宾县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,595.75","type":"DATA_CELL","properties":{"position":"0:194","raw":"18595.752"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"百色市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[百色市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"9,842.36","type":"DATA_CELL","properties":{"position":"0:195","raw":"9842.364"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"贵港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贵港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"27,182.53","type":"DATA_CELL","properties":{"position":"0:196","raw":"27182.526"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"贵港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贵港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"平南县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贵港市].[平南县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,299.28","type":"DATA_CELL","properties":{"position":"0:197","raw":"5299.28"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"贵港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贵港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"桂平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贵港市].[桂平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"21,883.25","type":"DATA_CELL","properties":{"position":"0:198","raw":"21883.246"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"贺州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贺州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"241.64","type":"DATA_CELL","properties":{"position":"0:199","raw":"241.64"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"贺州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贺州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"八步区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[贺州市].[八步区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"241.64","type":"DATA_CELL","properties":{"position":"0:200","raw":"241.64"}}],[{"value":"广西壮族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"钦州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[广西壮族自治区].[钦州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"43,580.36","type":"DATA_CELL","properties":{"position":"0:201","raw":"43580.362"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,000,222.85","type":"DATA_CELL","properties":{"position":"0:202","raw":"1000222.853"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"三门峡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[三门峡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,144.02","type":"DATA_CELL","properties":{"position":"0:203","raw":"1144.024"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"三门峡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[三门峡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"义马市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[三门峡市].[义马市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,144.02","type":"DATA_CELL","properties":{"position":"0:204","raw":"1144.024"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"信阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[信阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"38,849.41","type":"DATA_CELL","properties":{"position":"0:205","raw":"38849.412"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"89,375.90","type":"DATA_CELL","properties":{"position":"0:206","raw":"89375.902"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"唐河县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市].[唐河县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,764.90","type":"DATA_CELL","properties":{"position":"0:207","raw":"1764.896"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新野县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市].[新野县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"122.92","type":"DATA_CELL","properties":{"position":"0:208","raw":"122.92"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邓州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[南阳市].[邓州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"25,383.54","type":"DATA_CELL","properties":{"position":"0:209","raw":"25383.54"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"周口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[周口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"68,110.69","type":"DATA_CELL","properties":{"position":"0:210","raw":"68110.686"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"周口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[周口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"西华县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[周口市].[西华县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,261.33","type":"DATA_CELL","properties":{"position":"0:211","raw":"6261.332"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"周口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[周口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"郸城县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[周口市].[郸城县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"16,907.91","type":"DATA_CELL","properties":{"position":"0:212","raw":"16907.912"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"商丘市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[商丘市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"36,668.28","type":"DATA_CELL","properties":{"position":"0:213","raw":"36668.275"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"安阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[安阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"38,320.32","type":"DATA_CELL","properties":{"position":"0:214","raw":"38320.324"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"安阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[安阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"安阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[安阳市].[安阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"38,320.32","type":"DATA_CELL","properties":{"position":"0:215","raw":"38320.324"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"平顶山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[平顶山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"57,813.17","type":"DATA_CELL","properties":{"position":"0:216","raw":"57813.168"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"平顶山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[平顶山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"石龙区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[平顶山市].[石龙区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,330.22","type":"DATA_CELL","properties":{"position":"0:217","raw":"12330.22"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"开封市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[开封市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"77,277.20","type":"DATA_CELL","properties":{"position":"0:218","raw":"77277.2"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"开封市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[开封市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"开封县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[开封市].[开封县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"77,277.20","type":"DATA_CELL","properties":{"position":"0:219","raw":"77277.2"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"新乡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[新乡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"38,902.33","type":"DATA_CELL","properties":{"position":"0:220","raw":"38902.332"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"新乡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[新乡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新乡县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[新乡市].[新乡县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"38,902.33","type":"DATA_CELL","properties":{"position":"0:221","raw":"38902.332"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"洛阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[洛阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"231,395.85","type":"DATA_CELL","properties":{"position":"0:222","raw":"231395.85"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"漯河市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[漯河市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"7,228.17","type":"DATA_CELL","properties":{"position":"0:223","raw":"7228.172"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"濮阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[濮阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,663.72","type":"DATA_CELL","properties":{"position":"0:224","raw":"10663.716"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"濮阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[濮阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"濮阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[濮阳市].[濮阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,663.72","type":"DATA_CELL","properties":{"position":"0:225","raw":"10663.716"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"焦作市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[焦作市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"29,025.16","type":"DATA_CELL","properties":{"position":"0:226","raw":"29025.164"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"焦作市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[焦作市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"济源市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[焦作市].[济源市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,686.52","type":"DATA_CELL","properties":{"position":"0:227","raw":"5686.52"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"许昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"54,250.24","type":"DATA_CELL","properties":{"position":"0:228","raw":"54250.238"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"许昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"禹州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市].[禹州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,608.18","type":"DATA_CELL","properties":{"position":"0:229","raw":"8608.18"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"许昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"襄城县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市].[襄城县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,704.63","type":"DATA_CELL","properties":{"position":"0:230","raw":"14704.634"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"许昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"许昌县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[许昌市].[许昌县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"30,937.42","type":"DATA_CELL","properties":{"position":"0:231","raw":"30937.424"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"郑州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[郑州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"157,314.35","type":"DATA_CELL","properties":{"position":"0:232","raw":"157314.346"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"郑州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[郑州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"登封市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[郑州市].[登封市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,957.33","type":"DATA_CELL","properties":{"position":"0:233","raw":"18957.33"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"驻马店市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[驻马店市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,387.79","type":"DATA_CELL","properties":{"position":"0:234","raw":"8387.792"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鹤壁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[鹤壁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"55,496.25","type":"DATA_CELL","properties":{"position":"0:235","raw":"55496.252"}}],[{"value":"河南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鹤壁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[鹤壁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"山城区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[河南省].[鹤壁市].[山城区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"30,980.04","type":"DATA_CELL","properties":{"position":"0:236","raw":"30980.04"}}],[{"value":"海南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"144,851.08","type":"DATA_CELL","properties":{"position":"0:237","raw":"144851.084"}}],[{"value":"海南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"三亚市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省].[三亚市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"22,698.40","type":"DATA_CELL","properties":{"position":"0:238","raw":"22698.396"}}],[{"value":"海南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"海口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省].[海口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"122,152.69","type":"DATA_CELL","properties":{"position":"0:239","raw":"122152.688"}}],[{"value":"海南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"海口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省].[海口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"琼山区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[海南省].[海口市].[琼山区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"391.02","type":"DATA_CELL","properties":{"position":"0:240","raw":"391.02"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"632,633.65","type":"DATA_CELL","properties":{"position":"0:241","raw":"632633.652"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"仙桃市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[仙桃市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"16,600.16","type":"DATA_CELL","properties":{"position":"0:242","raw":"16600.164"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"十堰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[十堰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,879.62","type":"DATA_CELL","properties":{"position":"0:243","raw":"4879.616"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"十堰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[十堰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"丹江口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[十堰市].[丹江口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,879.62","type":"DATA_CELL","properties":{"position":"0:244","raw":"4879.616"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"咸宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[咸宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,256.75","type":"DATA_CELL","properties":{"position":"0:245","raw":"8256.752"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"咸宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[咸宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"赤壁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[咸宁市].[赤壁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,615.58","type":"DATA_CELL","properties":{"position":"0:246","raw":"4615.576"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"天门市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[天门市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,538.88","type":"DATA_CELL","properties":{"position":"0:247","raw":"4538.884"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"孝感市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[孝感市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"33,134.44","type":"DATA_CELL","properties":{"position":"0:248","raw":"33134.444"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"孝感市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[孝感市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"应城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[孝感市].[应城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,813.02","type":"DATA_CELL","properties":{"position":"0:249","raw":"12813.024"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"孝感市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[孝感市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"汉川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[孝感市].[汉川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,669.16","type":"DATA_CELL","properties":{"position":"0:250","raw":"1669.164"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宜昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[宜昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"57,743.31","type":"DATA_CELL","properties":{"position":"0:251","raw":"57743.308"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宜昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[宜昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宜都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[宜昌市].[宜都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,903.84","type":"DATA_CELL","properties":{"position":"0:252","raw":"18903.836"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宜昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[宜昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"枝江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[宜昌市].[枝江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,918.88","type":"DATA_CELL","properties":{"position":"0:253","raw":"3918.88"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"恩施土家族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[恩施土家族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"824.63","type":"DATA_CELL","properties":{"position":"0:254","raw":"824.628"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"恩施土家族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[恩施土家族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"利川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[恩施土家族苗族自治州].[利川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24.70","type":"DATA_CELL","properties":{"position":"0:255","raw":"24.696"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"恩施土家族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[恩施土家族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"恩施市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[恩施土家族苗族自治州].[恩施市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"799.93","type":"DATA_CELL","properties":{"position":"0:256","raw":"799.932"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"武汉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[武汉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"234,096.77","type":"DATA_CELL","properties":{"position":"0:257","raw":"234096.772"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"武汉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[武汉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"蔡甸区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[武汉市].[蔡甸区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,372.24","type":"DATA_CELL","properties":{"position":"0:258","raw":"2372.244"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"武汉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[武汉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄陂区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[武汉市].[黄陂区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,821.88","type":"DATA_CELL","properties":{"position":"0:259","raw":"1821.876"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荆州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"26,775.06","type":"DATA_CELL","properties":{"position":"0:260","raw":"26775.056"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荆州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"沙市区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆州市].[沙市区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,401.90","type":"DATA_CELL","properties":{"position":"0:261","raw":"2401.896"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荆州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"荆州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆州市].[荆州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,004.94","type":"DATA_CELL","properties":{"position":"0:262","raw":"13004.936"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荆门市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆门市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"26,214.78","type":"DATA_CELL","properties":{"position":"0:263","raw":"26214.776"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荆门市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆门市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"钟祥市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[荆门市].[钟祥市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,458.19","type":"DATA_CELL","properties":{"position":"0:264","raw":"11458.188"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"襄樊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"113,308.52","type":"DATA_CELL","properties":{"position":"0:265","raw":"113308.524"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"襄樊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宜城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市].[宜城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,582.94","type":"DATA_CELL","properties":{"position":"0:266","raw":"9582.944"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"襄樊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"枣阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市].[枣阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,255.19","type":"DATA_CELL","properties":{"position":"0:267","raw":"14255.192"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"襄樊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"老河口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[襄樊市].[老河口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"16,095.77","type":"DATA_CELL","properties":{"position":"0:268","raw":"16095.772"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鄂州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[鄂州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"24,234.08","type":"DATA_CELL","properties":{"position":"0:269","raw":"24234.084"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"随州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[随州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"30,956.60","type":"DATA_CELL","properties":{"position":"0:270","raw":"30956.604"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"随州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[随州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"广水市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[随州市].[广水市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,205.46","type":"DATA_CELL","properties":{"position":"0:271","raw":"11205.46"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄冈市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"17,299.60","type":"DATA_CELL","properties":{"position":"0:272","raw":"17299.604"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄冈市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"武穴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市].[武穴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,380.50","type":"DATA_CELL","properties":{"position":"0:273","raw":"2380.504"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄冈市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"浠水县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市].[浠水县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,153.51","type":"DATA_CELL","properties":{"position":"0:274","raw":"2153.508"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄冈市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"麻城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市].[麻城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,187.17","type":"DATA_CELL","properties":{"position":"0:275","raw":"1187.172"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄冈市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市].[黄州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,425.36","type":"DATA_CELL","properties":{"position":"0:276","raw":"2425.36"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄冈市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄梅县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄冈市].[黄梅县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,153.06","type":"DATA_CELL","properties":{"position":"0:277","raw":"9153.06"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄石市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄石市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"33,770.44","type":"DATA_CELL","properties":{"position":"0:278","raw":"33770.436"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄石市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄石市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"大冶市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄石市].[大冶市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"319.79","type":"DATA_CELL","properties":{"position":"0:279","raw":"319.788"}}],[{"value":"湖北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄石市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄石市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄石港区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖北省].[黄石市].[黄石港区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"33,450.65","type":"DATA_CELL","properties":{"position":"0:280","raw":"33450.648"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"715,830.69","type":"DATA_CELL","properties":{"position":"0:281","raw":"715830.689"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"娄底市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[娄底市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"55,215.81","type":"DATA_CELL","properties":{"position":"0:282","raw":"55215.811"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"娄底市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[娄底市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新化县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[娄底市].[新化县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,704.48","type":"DATA_CELL","properties":{"position":"0:283","raw":"11704.476"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"娄底市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[娄底市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"涟源市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[娄底市].[涟源市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"40,973.56","type":"DATA_CELL","properties":{"position":"0:284","raw":"40973.555"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"岳阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[岳阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"119,747.49","type":"DATA_CELL","properties":{"position":"0:285","raw":"119747.488"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"岳阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[岳阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"岳阳楼区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[岳阳市].[岳阳楼区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"119,747.49","type":"DATA_CELL","properties":{"position":"0:286","raw":"119747.488"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"常德市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[常德市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"53,087.23","type":"DATA_CELL","properties":{"position":"0:287","raw":"53087.23"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"常德市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[常德市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"津市市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[常德市].[津市市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,810.08","type":"DATA_CELL","properties":{"position":"0:288","raw":"2810.08"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"怀化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[怀化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"21,229.63","type":"DATA_CELL","properties":{"position":"0:289","raw":"21229.628"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"怀化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[怀化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"洪江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[怀化市].[洪江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,625.62","type":"DATA_CELL","properties":{"position":"0:290","raw":"5625.62"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"株洲市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[株洲市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"63,644.64","type":"DATA_CELL","properties":{"position":"0:291","raw":"63644.644"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"株洲市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[株洲市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"株洲县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[株洲市].[株洲县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"41,444.70","type":"DATA_CELL","properties":{"position":"0:292","raw":"41444.704"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"株洲市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[株洲市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"醴陵市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[株洲市].[醴陵市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"22,199.94","type":"DATA_CELL","properties":{"position":"0:293","raw":"22199.94"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"永州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[永州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"120,082.86","type":"DATA_CELL","properties":{"position":"0:294","raw":"120082.858"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"永州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[永州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"冷水滩区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[永州市].[冷水滩区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"25,959.14","type":"DATA_CELL","properties":{"position":"0:295","raw":"25959.136"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"永州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[永州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"双牌县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[永州市].[双牌县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"94,123.72","type":"DATA_CELL","properties":{"position":"0:296","raw":"94123.722"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湘潭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘潭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"37,940.43","type":"DATA_CELL","properties":{"position":"0:297","raw":"37940.434"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湘潭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘潭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"湘乡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘潭市].[湘乡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,227.63","type":"DATA_CELL","properties":{"position":"0:298","raw":"5227.628"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湘潭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘潭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"湘潭县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘潭市].[湘潭县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"32,712.81","type":"DATA_CELL","properties":{"position":"0:299","raw":"32712.806"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湘西土家族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘西土家族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"9,007.64","type":"DATA_CELL","properties":{"position":"0:300","raw":"9007.642"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湘西土家族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘西土家族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"吉首市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[湘西土家族苗族自治州].[吉首市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,007.64","type":"DATA_CELL","properties":{"position":"0:301","raw":"9007.642"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"益阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[益阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"47,683.10","type":"DATA_CELL","properties":{"position":"0:302","raw":"47683.104"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"益阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[益阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"沅江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[益阳市].[沅江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,611.78","type":"DATA_CELL","properties":{"position":"0:303","raw":"2611.784"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"衡阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[衡阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"83,776.94","type":"DATA_CELL","properties":{"position":"0:304","raw":"83776.938"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"衡阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[衡阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"耒阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[衡阳市].[耒阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"34,530.85","type":"DATA_CELL","properties":{"position":"0:305","raw":"34530.846"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"衡阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[衡阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"衡阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[衡阳市].[衡阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"49,246.09","type":"DATA_CELL","properties":{"position":"0:306","raw":"49246.092"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"郴州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[郴州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"5,884.87","type":"DATA_CELL","properties":{"position":"0:307","raw":"5884.872"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长沙市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[长沙市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"98,530.04","type":"DATA_CELL","properties":{"position":"0:308","raw":"98530.04"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长沙市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[长沙市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"浏阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[长沙市].[浏阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,254.20","type":"DATA_CELL","properties":{"position":"0:309","raw":"9254.196"}}],[{"value":"湖南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长沙市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[长沙市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"长沙县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[中南].[湖南省].[长沙市].[长沙县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"89,275.84","type":"DATA_CELL","properties":{"position":"0:310","raw":"89275.844"}}],[{"value":"上海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[上海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"582,450.57","type":"DATA_CELL","properties":{"position":"0:311","raw":"582450.568"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"557,968.50","type":"DATA_CELL","properties":{"position":"0:312","raw":"557968.495"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"亳州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[亳州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"16,961.14","type":"DATA_CELL","properties":{"position":"0:313","raw":"16961.14"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"合肥市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[合肥市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"82,420.55","type":"DATA_CELL","properties":{"position":"0:314","raw":"82420.548"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"安庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[安庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,239.29","type":"DATA_CELL","properties":{"position":"0:315","raw":"10239.292"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宣城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[宣城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,007.94","type":"DATA_CELL","properties":{"position":"0:316","raw":"1007.944"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宣城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[宣城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宣州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[宣城市].[宣州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,007.94","type":"DATA_CELL","properties":{"position":"0:317","raw":"1007.944"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宿州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[宿州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"137,112.40","type":"DATA_CELL","properties":{"position":"0:318","raw":"137112.395"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"巢湖市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[巢湖市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"40,566.62","type":"DATA_CELL","properties":{"position":"0:319","raw":"40566.624"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"池州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[池州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"12,512.08","type":"DATA_CELL","properties":{"position":"0:320","raw":"12512.08"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淮北市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[淮北市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"14,529.62","type":"DATA_CELL","properties":{"position":"0:321","raw":"14529.62"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淮北市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[淮北市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"濉溪县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[淮北市].[濉溪县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"482.72","type":"DATA_CELL","properties":{"position":"0:322","raw":"482.72"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淮南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[淮南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"43,026.03","type":"DATA_CELL","properties":{"position":"0:323","raw":"43026.032"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"滁州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[滁州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"40,395.47","type":"DATA_CELL","properties":{"position":"0:324","raw":"40395.474"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"滁州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[滁州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"天长市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[滁州市].[天长市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"22,612.59","type":"DATA_CELL","properties":{"position":"0:325","raw":"22612.59"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"滁州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[滁州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"明光市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[滁州市].[明光市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,354.80","type":"DATA_CELL","properties":{"position":"0:326","raw":"2354.8"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"芜湖市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[芜湖市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"56,410.06","type":"DATA_CELL","properties":{"position":"0:327","raw":"56410.06"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"芜湖市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[芜湖市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"芜湖县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[芜湖市].[芜湖县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"56,410.06","type":"DATA_CELL","properties":{"position":"0:328","raw":"56410.06"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"蚌埠市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[蚌埠市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"42,192.64","type":"DATA_CELL","properties":{"position":"0:329","raw":"42192.64"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铜陵市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[铜陵市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"33,703.88","type":"DATA_CELL","properties":{"position":"0:330","raw":"33703.88"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铜陵市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[铜陵市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"铜陵县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[铜陵市].[铜陵县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"33,703.88","type":"DATA_CELL","properties":{"position":"0:331","raw":"33703.88"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阜阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[阜阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"18,701.05","type":"DATA_CELL","properties":{"position":"0:332","raw":"18701.046"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阜阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[阜阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"界首市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[阜阳市].[界首市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,676.21","type":"DATA_CELL","properties":{"position":"0:333","raw":"4676.21"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阜阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[阜阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"颍上县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[阜阳市].[颍上县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,559.80","type":"DATA_CELL","properties":{"position":"0:334","raw":"8559.796"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[黄山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,189.72","type":"DATA_CELL","properties":{"position":"0:335","raw":"8189.72"}}],[{"value":"安徽省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黄山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[黄山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄山区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[安徽省].[黄山市].[黄山区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,189.72","type":"DATA_CELL","properties":{"position":"0:336","raw":"8189.72"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,577,297.71","type":"DATA_CELL","properties":{"position":"0:337","raw":"1577297.708"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"东营市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[东营市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"17,153.92","type":"DATA_CELL","properties":{"position":"0:338","raw":"17153.92"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"东营市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[东营市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东营区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[东营市].[东营区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"17,153.92","type":"DATA_CELL","properties":{"position":"0:339","raw":"17153.92"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"临沂市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"139,717.40","type":"DATA_CELL","properties":{"position":"0:340","raw":"139717.396"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"临沂市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"平邑县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市].[平邑县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,395.50","type":"DATA_CELL","properties":{"position":"0:341","raw":"18395.496"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"临沂市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"沂水县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市].[沂水县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,099.36","type":"DATA_CELL","properties":{"position":"0:342","raw":"5099.36"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"临沂市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"蒙阴县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[临沂市].[蒙阴县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"19,021.80","type":"DATA_CELL","properties":{"position":"0:343","raw":"19021.8"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"十字路","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[十字路]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,417.88","type":"DATA_CELL","properties":{"position":"0:344","raw":"6417.88"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"威海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[威海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"49,380.38","type":"DATA_CELL","properties":{"position":"0:345","raw":"49380.38"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"威海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[威海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"文登市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[威海市].[文登市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"33,296.06","type":"DATA_CELL","properties":{"position":"0:346","raw":"33296.06"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"州城镇","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[州城镇]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"3,628.80","type":"DATA_CELL","properties":{"position":"0:347","raw":"3628.8"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"德州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[德州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"32,479.58","type":"DATA_CELL","properties":{"position":"0:348","raw":"32479.58"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"德州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[德州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"禹城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[德州市].[禹城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,545.58","type":"DATA_CELL","properties":{"position":"0:349","raw":"14545.58"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"日照市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[日照市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,715.14","type":"DATA_CELL","properties":{"position":"0:350","raw":"8715.14"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"枣庄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[枣庄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"88,702.04","type":"DATA_CELL","properties":{"position":"0:351","raw":"88702.04"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"枣庄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[枣庄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"山亭区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[枣庄市].[山亭区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,022.00","type":"DATA_CELL","properties":{"position":"0:352","raw":"1022.0"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"枣庄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[枣庄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"滕州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[枣庄市].[滕州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"51,497.04","type":"DATA_CELL","properties":{"position":"0:353","raw":"51497.04"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[泰安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"31,486.14","type":"DATA_CELL","properties":{"position":"0:354","raw":"31486.14"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[泰安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宁阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[泰安市].[宁阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,063.18","type":"DATA_CELL","properties":{"position":"0:355","raw":"2063.18"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[泰安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新泰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[泰安市].[新泰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"29,422.96","type":"DATA_CELL","properties":{"position":"0:356","raw":"29422.96"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"146,811.06","type":"DATA_CELL","properties":{"position":"0:357","raw":"146811.056"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"平阴县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济南市].[平阴县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"364.00","type":"DATA_CELL","properties":{"position":"0:358","raw":"364.0"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"长清区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济南市].[长清区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,749.42","type":"DATA_CELL","properties":{"position":"0:359","raw":"7749.42"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"214,031.16","type":"DATA_CELL","properties":{"position":"0:360","raw":"214031.16"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"兖州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市].[兖州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"28,648.20","type":"DATA_CELL","properties":{"position":"0:361","raw":"28648.2"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"曲阜市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市].[曲阜市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,541.96","type":"DATA_CELL","properties":{"position":"0:362","raw":"8541.96"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"汶上县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市].[汶上县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"732.76","type":"DATA_CELL","properties":{"position":"0:363","raw":"732.76"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"泗水县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市].[泗水县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,298.78","type":"DATA_CELL","properties":{"position":"0:364","raw":"1298.78"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邹城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市].[邹城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,692.14","type":"DATA_CELL","properties":{"position":"0:365","raw":"13692.14"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"济宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"金乡县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[济宁市].[金乡县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,181.75","type":"DATA_CELL","properties":{"position":"0:366","raw":"3181.752"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淄博市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[淄博市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"16,353.54","type":"DATA_CELL","properties":{"position":"0:367","raw":"16353.54"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淄博市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[淄博市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"周村区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[淄博市].[周村区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,413.06","type":"DATA_CELL","properties":{"position":"0:368","raw":"10413.06"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淄博市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[淄博市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"沂源县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[淄博市].[沂源县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,940.48","type":"DATA_CELL","properties":{"position":"0:369","raw":"5940.48"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"144,511.92","type":"DATA_CELL","properties":{"position":"0:370","raw":"144511.92"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"临朐县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市].[临朐县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"833.70","type":"DATA_CELL","properties":{"position":"0:371","raw":"833.7"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"安丘市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市].[安丘市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,400.86","type":"DATA_CELL","properties":{"position":"0:372","raw":"2400.86"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"寒亭区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市].[寒亭区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,996.88","type":"DATA_CELL","properties":{"position":"0:373","raw":"11996.88"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"寿光市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市].[寿光市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"29,014.58","type":"DATA_CELL","properties":{"position":"0:374","raw":"29014.58"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"青州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市].[青州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"26,504.94","type":"DATA_CELL","properties":{"position":"0:375","raw":"26504.94"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"潍坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"高密市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[潍坊市].[高密市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,257.44","type":"DATA_CELL","properties":{"position":"0:376","raw":"6257.44"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"178,637.73","type":"DATA_CELL","properties":{"position":"0:377","raw":"178637.732"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"招远市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市].[招远市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"38,868.48","type":"DATA_CELL","properties":{"position":"0:378","raw":"38868.48"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"栖霞市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市].[栖霞市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,792.76","type":"DATA_CELL","properties":{"position":"0:379","raw":"18792.76"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"莱州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市].[莱州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,616.82","type":"DATA_CELL","properties":{"position":"0:380","raw":"13616.82"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"莱阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市].[莱阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,998.79","type":"DATA_CELL","properties":{"position":"0:381","raw":"24998.792"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"蓬莱市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市].[蓬莱市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,863.18","type":"DATA_CELL","properties":{"position":"0:382","raw":"11863.18"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"烟台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[烟台市].[龙口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,317.02","type":"DATA_CELL","properties":{"position":"0:383","raw":"10317.02"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"14,756.56","type":"DATA_CELL","properties":{"position":"0:384","raw":"14756.56"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绥化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[绥化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"明水县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[绥化市].[明水县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,756.56","type":"DATA_CELL","properties":{"position":"0:385","raw":"14756.56"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"聊城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"90,990.06","type":"DATA_CELL","properties":{"position":"0:386","raw":"90990.06"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"聊城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"临清市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市].[临清市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"38,676.12","type":"DATA_CELL","properties":{"position":"0:387","raw":"38676.12"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"聊城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"莘县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市].[莘县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,726.24","type":"DATA_CELL","properties":{"position":"0:388","raw":"3726.24"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"聊城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阳谷县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[聊城市].[阳谷县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,889.72","type":"DATA_CELL","properties":{"position":"0:389","raw":"8889.72"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荷泽市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[荷泽市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,897.90","type":"DATA_CELL","properties":{"position":"0:390","raw":"4897.9"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荷泽市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[荷泽市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"定陶县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[荷泽市].[定陶县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,627.84","type":"DATA_CELL","properties":{"position":"0:391","raw":"4627.84"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"荷泽市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[荷泽市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"巨野县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[荷泽市].[巨野县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"270.06","type":"DATA_CELL","properties":{"position":"0:392","raw":"270.06"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"莱芜市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[莱芜市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,543.30","type":"DATA_CELL","properties":{"position":"0:393","raw":"19543.3"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"菏泽市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[菏泽市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"23,680.16","type":"DATA_CELL","properties":{"position":"0:394","raw":"23680.16"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"青岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"345,403.04","type":"DATA_CELL","properties":{"position":"0:395","raw":"345403.044"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"青岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"即墨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市].[即墨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,251.58","type":"DATA_CELL","properties":{"position":"0:396","raw":"14251.58"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"青岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"平度市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市].[平度市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,853.66","type":"DATA_CELL","properties":{"position":"0:397","raw":"18853.66"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"青岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"胶南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市].[胶南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"56,684.60","type":"DATA_CELL","properties":{"position":"0:398","raw":"56684.6"}}],[{"value":"山东省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"青岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"胶州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[山东省].[青岛市].[胶州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"49,296.94","type":"DATA_CELL","properties":{"position":"0:399","raw":"49296.94"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"611,601.59","type":"DATA_CELL","properties":{"position":"0:400","raw":"611601.592"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"17,161.79","type":"DATA_CELL","properties":{"position":"0:401","raw":"17161.788"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"六合区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市].[六合区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,775.98","type":"DATA_CELL","properties":{"position":"0:402","raw":"5775.98"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"栖霞区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市].[栖霞区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,085.74","type":"DATA_CELL","properties":{"position":"0:403","raw":"3085.74"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"鼓楼区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南京市].[鼓楼区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,300.07","type":"DATA_CELL","properties":{"position":"0:404","raw":"8300.068"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南通市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南通市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"48,581.18","type":"DATA_CELL","properties":{"position":"0:405","raw":"48581.176"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南通市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南通市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"启东市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[南通市].[启东市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"22,022.67","type":"DATA_CELL","properties":{"position":"0:406","raw":"22022.672"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宿迁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[宿迁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"2,620.13","type":"DATA_CELL","properties":{"position":"0:407","raw":"2620.128"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宿迁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[宿迁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"泗洪县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[宿迁市].[泗洪县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,620.13","type":"DATA_CELL","properties":{"position":"0:408","raw":"2620.128"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"常州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[常州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"72,550.24","type":"DATA_CELL","properties":{"position":"0:409","raw":"72550.24"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"徐州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[徐州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"113,555.85","type":"DATA_CELL","properties":{"position":"0:410","raw":"113555.848"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"徐州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[徐州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"丰县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[徐州市].[丰县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,309.52","type":"DATA_CELL","properties":{"position":"0:411","raw":"10309.516"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"徐州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[徐州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邳州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[徐州市].[邳州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,260.42","type":"DATA_CELL","properties":{"position":"0:412","raw":"12260.416"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"扬州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"92,025.78","type":"DATA_CELL","properties":{"position":"0:413","raw":"92025.78"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"扬州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"仪征市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市].[仪征市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,566.63","type":"DATA_CELL","properties":{"position":"0:414","raw":"8566.628"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"扬州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宝应县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市].[宝应县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,835.46","type":"DATA_CELL","properties":{"position":"0:415","raw":"4835.46"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"扬州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"江都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市].[江都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,621.66","type":"DATA_CELL","properties":{"position":"0:416","raw":"24621.66"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"扬州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"高邮市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[扬州市].[高邮市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,141.86","type":"DATA_CELL","properties":{"position":"0:417","raw":"13141.856"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"无锡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[无锡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"57,654.63","type":"DATA_CELL","properties":{"position":"0:418","raw":"57654.632"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"59,113.82","type":"DATA_CELL","properties":{"position":"0:419","raw":"59113.824"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"兴化市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市].[兴化市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,848.65","type":"DATA_CELL","properties":{"position":"0:420","raw":"7848.652"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"姜堰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市].[姜堰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,361.92","type":"DATA_CELL","properties":{"position":"0:421","raw":"8361.92"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泰州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"泰兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[泰州市].[泰兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"16,046.69","type":"DATA_CELL","properties":{"position":"0:422","raw":"16046.688"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淮安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[淮安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"17,803.32","type":"DATA_CELL","properties":{"position":"0:423","raw":"17803.324"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"淮安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[淮安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"淮阴区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[淮安市].[淮阴区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"17,803.32","type":"DATA_CELL","properties":{"position":"0:424","raw":"17803.324"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"盐城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[盐城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"35,848.88","type":"DATA_CELL","properties":{"position":"0:425","raw":"35848.876"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"盐城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[盐城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[盐城市].[东台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,789.89","type":"DATA_CELL","properties":{"position":"0:426","raw":"2789.892"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"苏州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[苏州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"77,716.80","type":"DATA_CELL","properties":{"position":"0:427","raw":"77716.8"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"苏州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[苏州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"常熟市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[苏州市].[常熟市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,245.16","type":"DATA_CELL","properties":{"position":"0:428","raw":"5245.156"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"苏州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[苏州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"张家港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[苏州市].[张家港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,376.24","type":"DATA_CELL","properties":{"position":"0:429","raw":"10376.24"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"连云港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[连云港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,836.13","type":"DATA_CELL","properties":{"position":"0:430","raw":"4836.132"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"连云港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[连云港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东海县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[连云港市].[东海县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,508.28","type":"DATA_CELL","properties":{"position":"0:431","raw":"4508.28"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"连云港市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[连云港市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"海州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[连云港市].[海州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"327.85","type":"DATA_CELL","properties":{"position":"0:432","raw":"327.852"}}],[{"value":"江苏省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"镇江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江苏省].[镇江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"12,133.04","type":"DATA_CELL","properties":{"position":"0:433","raw":"12133.044"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"329,402.53","type":"DATA_CELL","properties":{"position":"0:434","raw":"329402.528"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"上饶市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[上饶市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"14,316.96","type":"DATA_CELL","properties":{"position":"0:435","raw":"14316.96"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"上饶市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[上饶市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"鄱阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[上饶市].[鄱阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,316.96","type":"DATA_CELL","properties":{"position":"0:436","raw":"14316.96"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"九江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[九江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"29,890.70","type":"DATA_CELL","properties":{"position":"0:437","raw":"29890.7"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"九江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[九江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"九江县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[九江市].[九江县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"29,890.70","type":"DATA_CELL","properties":{"position":"0:438","raw":"29890.7"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[南昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"46,190.62","type":"DATA_CELL","properties":{"position":"0:439","raw":"46190.62"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[南昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"南昌县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[南昌市].[南昌县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"46,190.62","type":"DATA_CELL","properties":{"position":"0:440","raw":"46190.62"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宜春市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[宜春市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"115,788.29","type":"DATA_CELL","properties":{"position":"0:441","raw":"115788.288"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"新余市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[新余市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"18,479.16","type":"DATA_CELL","properties":{"position":"0:442","raw":"18479.16"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"景德镇市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[景德镇市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"68,907.30","type":"DATA_CELL","properties":{"position":"0:443","raw":"68907.3"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"萍乡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[萍乡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"28,258.72","type":"DATA_CELL","properties":{"position":"0:444","raw":"28258.72"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鹰潭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[鹰潭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"7,570.78","type":"DATA_CELL","properties":{"position":"0:445","raw":"7570.78"}}],[{"value":"江西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鹰潭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[鹰潭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"贵溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[江西省].[鹰潭市].[贵溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,570.78","type":"DATA_CELL","properties":{"position":"0:446","raw":"7570.78"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"594,891.36","type":"DATA_CELL","properties":{"position":"0:447","raw":"594891.36"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"丽水市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[丽水市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"58,772.76","type":"DATA_CELL","properties":{"position":"0:448","raw":"58772.756"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"丽水市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[丽水市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙泉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[丽水市].[龙泉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"54,789.14","type":"DATA_CELL","properties":{"position":"0:449","raw":"54789.14"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"台州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"40,763.38","type":"DATA_CELL","properties":{"position":"0:450","raw":"40763.38"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"台州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"临海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市].[临海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,071.46","type":"DATA_CELL","properties":{"position":"0:451","raw":"7071.456"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"台州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"仙居县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市].[仙居县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,868.51","type":"DATA_CELL","properties":{"position":"0:452","raw":"6868.512"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"台州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"椒江区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市].[椒江区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,225.89","type":"DATA_CELL","properties":{"position":"0:453","raw":"9225.888"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"台州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"温岭市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市].[温岭市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"13,616.15","type":"DATA_CELL","properties":{"position":"0:454","raw":"13616.148"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"台州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黄岩区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[台州市].[黄岩区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,981.38","type":"DATA_CELL","properties":{"position":"0:455","raw":"3981.376"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"嘉兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[嘉兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"26,623.49","type":"DATA_CELL","properties":{"position":"0:456","raw":"26623.492"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"嘉兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[嘉兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"嘉善县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[嘉兴市].[嘉善县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,711.08","type":"DATA_CELL","properties":{"position":"0:457","raw":"1711.08"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宁波市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[宁波市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"89,670.70","type":"DATA_CELL","properties":{"position":"0:458","raw":"89670.7"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宁波市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[宁波市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"余姚市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[宁波市].[余姚市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,621.84","type":"DATA_CELL","properties":{"position":"0:459","raw":"12621.84"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宁波市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[宁波市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宁海县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[宁波市].[宁海县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"46,008.90","type":"DATA_CELL","properties":{"position":"0:460","raw":"46008.9"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"杭州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[杭州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"127,420.08","type":"DATA_CELL","properties":{"position":"0:461","raw":"127420.076"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"杭州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[杭州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"富阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[杭州市].[富阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,781.13","type":"DATA_CELL","properties":{"position":"0:462","raw":"12781.132"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"温州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[温州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"69,114.89","type":"DATA_CELL","properties":{"position":"0:463","raw":"69114.892"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"温州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[温州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"平阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[温州市].[平阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"319.54","type":"DATA_CELL","properties":{"position":"0:464","raw":"319.536"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"温州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[温州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"鹿城区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[温州市].[鹿城区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"18,225.62","type":"DATA_CELL","properties":{"position":"0:465","raw":"18225.62"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湖州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[湖州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,709.23","type":"DATA_CELL","properties":{"position":"0:466","raw":"19709.228"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"湖州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[湖州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"德清县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[湖州市].[德清县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,872.81","type":"DATA_CELL","properties":{"position":"0:467","raw":"4872.812"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绍兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"36,359.51","type":"DATA_CELL","properties":{"position":"0:468","raw":"36359.512"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绍兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"上虞市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市].[上虞市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,672.87","type":"DATA_CELL","properties":{"position":"0:469","raw":"10672.872"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绍兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"绍兴县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市].[绍兴县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"22,116.11","type":"DATA_CELL","properties":{"position":"0:470","raw":"22116.108"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绍兴市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"诸暨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[绍兴市].[诸暨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,570.53","type":"DATA_CELL","properties":{"position":"0:471","raw":"3570.532"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"衢州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[衢州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"51,749.77","type":"DATA_CELL","properties":{"position":"0:472","raw":"51749.768"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"衢州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[衢州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"开化县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[衢州市].[开化县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"47,997.57","type":"DATA_CELL","properties":{"position":"0:473","raw":"47997.572"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"金华市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[金华市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"74,707.56","type":"DATA_CELL","properties":{"position":"0:474","raw":"74707.556"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"金华市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[金华市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"义乌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[金华市].[义乌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"34,511.62","type":"DATA_CELL","properties":{"position":"0:475","raw":"34511.624"}}],[{"value":"浙江省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"金华市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[金华市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"兰溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[浙江省].[金华市].[兰溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"15,169.03","type":"DATA_CELL","properties":{"position":"0:476","raw":"15169.028"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"485,147.13","type":"DATA_CELL","properties":{"position":"0:477","raw":"485147.131"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"三明市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[三明市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,458.80","type":"DATA_CELL","properties":{"position":"0:478","raw":"1458.8"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[南平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"41,564.04","type":"DATA_CELL","properties":{"position":"0:479","raw":"41564.04"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[南平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"浦城县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[南平市].[浦城县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,786.50","type":"DATA_CELL","properties":{"position":"0:480","raw":"6786.5"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[南平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邵武市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[南平市].[邵武市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"23,511.32","type":"DATA_CELL","properties":{"position":"0:481","raw":"23511.32"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"厦门市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[厦门市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"144,801.94","type":"DATA_CELL","properties":{"position":"0:482","raw":"144801.944"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宁德市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[宁德市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"7,081.23","type":"DATA_CELL","properties":{"position":"0:483","raw":"7081.228"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宁德市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[宁德市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"福鼎市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[宁德市].[福鼎市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,081.23","type":"DATA_CELL","properties":{"position":"0:484","raw":"7081.228"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泉州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[泉州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"150,810.22","type":"DATA_CELL","properties":{"position":"0:485","raw":"150810.219"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"泉州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[泉州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"晋江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[泉州市].[晋江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"49,001.38","type":"DATA_CELL","properties":{"position":"0:486","raw":"49001.379"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"漳州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[漳州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,148.98","type":"DATA_CELL","properties":{"position":"0:487","raw":"8148.98"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"福州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[福州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"78,509.34","type":"DATA_CELL","properties":{"position":"0:488","raw":"78509.34"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"福州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[福州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"鼓楼区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[福州市].[鼓楼区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"78,509.34","type":"DATA_CELL","properties":{"position":"0:489","raw":"78509.34"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"莆田市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[莆田市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"52,772.58","type":"DATA_CELL","properties":{"position":"0:490","raw":"52772.58"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"莆田市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[莆田市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"仙游县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[莆田市].[仙游县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"131.32","type":"DATA_CELL","properties":{"position":"0:491","raw":"131.32"}}],[{"value":"福建省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"莆田市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[莆田市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"荔城区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华东].[福建省].[莆田市].[荔城区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,433.66","type":"DATA_CELL","properties":{"position":"0:492","raw":"4433.66"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"202,071.46","type":"DATA_CELL","properties":{"position":"0:493","raw":"202071.464"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"乌兰察布市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[乌兰察布市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"3,507.34","type":"DATA_CELL","properties":{"position":"0:494","raw":"3507.336"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"乌兰察布市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[乌兰察布市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"丰镇市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[乌兰察布市].[丰镇市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,507.34","type":"DATA_CELL","properties":{"position":"0:495","raw":"3507.336"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"乌海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[乌海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,571.30","type":"DATA_CELL","properties":{"position":"0:496","raw":"19571.3"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"乌海市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[乌海市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"乌达区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[乌海市].[乌达区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,474.66","type":"DATA_CELL","properties":{"position":"0:497","raw":"3474.66"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"加格达奇","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[加格达奇]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,801.32","type":"DATA_CELL","properties":{"position":"0:498","raw":"1801.324"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"包头市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[包头市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"43,217.52","type":"DATA_CELL","properties":{"position":"0:499","raw":"43217.524"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"呼伦贝尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"53,482.21","type":"DATA_CELL","properties":{"position":"0:500","raw":"53482.212"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"呼伦贝尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"海拉尔区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市].[海拉尔区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,790.44","type":"DATA_CELL","properties":{"position":"0:501","raw":"11790.436"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"呼伦贝尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"满洲里市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市].[满洲里市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,358.02","type":"DATA_CELL","properties":{"position":"0:502","raw":"9358.02"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"呼伦贝尔市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"牙克石市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼伦贝尔市].[牙克石市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"32,333.76","type":"DATA_CELL","properties":{"position":"0:503","raw":"32333.756"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"呼和浩特市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[呼和浩特市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"27,756.26","type":"DATA_CELL","properties":{"position":"0:504","raw":"27756.26"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"赤峰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[赤峰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"12,229.42","type":"DATA_CELL","properties":{"position":"0:505","raw":"12229.42"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"通辽市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[通辽市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"15,503.63","type":"DATA_CELL","properties":{"position":"0:506","raw":"15503.628"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鄂尔多斯市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[鄂尔多斯市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"12,766.07","type":"DATA_CELL","properties":{"position":"0:507","raw":"12766.068"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"鄂尔多斯市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[鄂尔多斯市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"东胜区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[鄂尔多斯市].[东胜区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,766.07","type":"DATA_CELL","properties":{"position":"0:508","raw":"12766.068"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"锡林郭勒盟","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[锡林郭勒盟]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"5,688.90","type":"DATA_CELL","properties":{"position":"0:509","raw":"5688.9"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"锡林郭勒盟","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[锡林郭勒盟]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"锡林浩特市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[锡林郭勒盟].[锡林浩特市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,688.90","type":"DATA_CELL","properties":{"position":"0:510","raw":"5688.9"}}],[{"value":"内蒙古自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阿里河","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[内蒙古自治区].[阿里河]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,547.49","type":"DATA_CELL","properties":{"position":"0:511","raw":"6547.492"}}],[{"value":"北京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"409,147.20","type":"DATA_CELL","properties":{"position":"0:512","raw":"409147.2"}}],[{"value":"北京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"房山区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市].[房山区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,924.02","type":"DATA_CELL","properties":{"position":"0:513","raw":"1924.02"}}],[{"value":"北京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"昌平区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市].[昌平区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"13,264.30","type":"DATA_CELL","properties":{"position":"0:514","raw":"13264.3"}}],[{"value":"北京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"通州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市].[通州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,398.04","type":"DATA_CELL","properties":{"position":"0:515","raw":"1398.04"}}],[{"value":"北京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"门头沟区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市].[门头沟区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"13,160.56","type":"DATA_CELL","properties":{"position":"0:516","raw":"13160.56"}}],[{"value":"北京市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"顺义区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[北京市].[顺义区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"2,585.38","type":"DATA_CELL","properties":{"position":"0:517","raw":"2585.38"}}],[{"value":"天津市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"549,521.49","type":"DATA_CELL","properties":{"position":"0:518","raw":"549521.49"}}],[{"value":"天津市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"咸水沽","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市].[咸水沽]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"9,269.54","type":"DATA_CELL","properties":{"position":"0:519","raw":"9269.54"}}],[{"value":"天津市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"塘沽区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市].[塘沽区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"45,260.46","type":"DATA_CELL","properties":{"position":"0:520","raw":"45260.46"}}],[{"value":"天津市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"杨柳青","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市].[杨柳青]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"340.90","type":"DATA_CELL","properties":{"position":"0:521","raw":"340.9"}}],[{"value":"天津市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汉沽区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[天津市].[汉沽区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"23,467.08","type":"DATA_CELL","properties":{"position":"0:522","raw":"23467.08"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"506,316.38","type":"DATA_CELL","properties":{"position":"0:523","raw":"506316.384"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"临汾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[临汾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"31,779.30","type":"DATA_CELL","properties":{"position":"0:524","raw":"31779.3"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"临汾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[临汾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"霍州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[临汾市].[霍州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,573.82","type":"DATA_CELL","properties":{"position":"0:525","raw":"5573.82"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大同市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[大同市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"133,256.41","type":"DATA_CELL","properties":{"position":"0:526","raw":"133256.41"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大同市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[大同市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"大同县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[大同市].[大同县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"67,623.78","type":"DATA_CELL","properties":{"position":"0:527","raw":"67623.78"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"太原市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[太原市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"171,042.62","type":"DATA_CELL","properties":{"position":"0:528","raw":"171042.62"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"忻州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[忻州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,930.20","type":"DATA_CELL","properties":{"position":"0:529","raw":"19930.204"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"忻州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[忻州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"原平市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[忻州市].[原平市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"97.58","type":"DATA_CELL","properties":{"position":"0:530","raw":"97.58"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"晋中市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[晋中市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"18,907.14","type":"DATA_CELL","properties":{"position":"0:531","raw":"18907.14"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"晋中市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[晋中市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"平遥县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[晋中市].[平遥县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,710.68","type":"DATA_CELL","properties":{"position":"0:532","raw":"2710.68"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"晋中市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[晋中市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"榆次区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[晋中市].[榆次区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"16,196.46","type":"DATA_CELL","properties":{"position":"0:533","raw":"16196.46"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"晋城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[晋城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"36,235.40","type":"DATA_CELL","properties":{"position":"0:534","raw":"36235.395"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"运城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[运城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"29,225.67","type":"DATA_CELL","properties":{"position":"0:535","raw":"29225.665"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长治市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[长治市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"40,397.35","type":"DATA_CELL","properties":{"position":"0:536","raw":"40397.35"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长治市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[长治市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"长治县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[长治市].[长治县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"31,539.97","type":"DATA_CELL","properties":{"position":"0:537","raw":"31539.97"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"长治市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[长治市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"黎城县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[长治市].[黎城县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,857.38","type":"DATA_CELL","properties":{"position":"0:538","raw":"8857.38"}}],[{"value":"山西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阳泉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[山西省].[阳泉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"25,542.30","type":"DATA_CELL","properties":{"position":"0:539","raw":"25542.3"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"767,119.54","type":"DATA_CELL","properties":{"position":"0:540","raw":"767119.535"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"保定市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[保定市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"134,610.42","type":"DATA_CELL","properties":{"position":"0:541","raw":"134610.42"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"保定市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[保定市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"定州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[保定市].[定州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"10,477.32","type":"DATA_CELL","properties":{"position":"0:542","raw":"10477.32"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"唐家庄","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[唐家庄]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,473.16","type":"DATA_CELL","properties":{"position":"0:543","raw":"10473.155"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"唐山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[唐山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"94,983.98","type":"DATA_CELL","properties":{"position":"0:544","raw":"94983.98"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"唐山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[唐山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"丰润区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[唐山市].[丰润区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"82.04","type":"DATA_CELL","properties":{"position":"0:545","raw":"82.04"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"廊坊市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[廊坊市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"29,600.06","type":"DATA_CELL","properties":{"position":"0:546","raw":"29600.06"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"张家口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[张家口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"95,021.89","type":"DATA_CELL","properties":{"position":"0:547","raw":"95021.885"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"张家口市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[张家口市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宣化区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[张家口市].[宣化区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"55,734.88","type":"DATA_CELL","properties":{"position":"0:548","raw":"55734.875"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"承德市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[承德市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,583.36","type":"DATA_CELL","properties":{"position":"0:549","raw":"6583.36"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"承德市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[承德市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"承德县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[承德市].[承德县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,583.36","type":"DATA_CELL","properties":{"position":"0:550","raw":"6583.36"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"沧州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[沧州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"37,021.46","type":"DATA_CELL","properties":{"position":"0:551","raw":"37021.46"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"沧州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[沧州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"任丘市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[沧州市].[任丘市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"12,106.78","type":"DATA_CELL","properties":{"position":"0:552","raw":"12106.78"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"石家庄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[石家庄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"131,276.08","type":"DATA_CELL","properties":{"position":"0:553","raw":"131276.075"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"石家庄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[石家庄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"栾城县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[石家庄市].[栾城县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"333.48","type":"DATA_CELL","properties":{"position":"0:554","raw":"333.48"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"石家庄市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[石家庄市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"辛集市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[石家庄市].[辛集市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,385.48","type":"DATA_CELL","properties":{"position":"0:555","raw":"3385.48"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"秦皇岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[秦皇岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"69,295.87","type":"DATA_CELL","properties":{"position":"0:556","raw":"69295.87"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"秦皇岛市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[秦皇岛市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"昌黎县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[秦皇岛市].[昌黎县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,302.24","type":"DATA_CELL","properties":{"position":"0:557","raw":"6302.24"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"衡水市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[衡水市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"7,885.92","type":"DATA_CELL","properties":{"position":"0:558","raw":"7885.92"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"邢台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邢台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"70,962.36","type":"DATA_CELL","properties":{"position":"0:559","raw":"70962.36"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"邢台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邢台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"南宫市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邢台市].[南宫市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,725.48","type":"DATA_CELL","properties":{"position":"0:560","raw":"14725.48"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"邢台市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邢台市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邢台县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邢台市].[邢台县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"56,236.88","type":"DATA_CELL","properties":{"position":"0:561","raw":"56236.88"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"邯郸市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邯郸市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"79,404.99","type":"DATA_CELL","properties":{"position":"0:562","raw":"79404.99"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"邯郸市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邯郸市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"峰峰矿区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邯郸市].[峰峰矿区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"21,443.10","type":"DATA_CELL","properties":{"position":"0:563","raw":"21443.1"}}],[{"value":"河北省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"邯郸市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邯郸市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邯郸县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[华北].[河北省].[邯郸市].[邯郸县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"57,961.89","type":"DATA_CELL","properties":{"position":"0:564","raw":"57961.89"}}],[{"value":"宁夏回族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"58,121.00","type":"DATA_CELL","properties":{"position":"0:565","raw":"58121.0"}}],[{"value":"宁夏回族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"石嘴山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区].[石嘴山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,855.61","type":"DATA_CELL","properties":{"position":"0:566","raw":"19855.612"}}],[{"value":"宁夏回族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"石炭井","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区].[石炭井]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,973.06","type":"DATA_CELL","properties":{"position":"0:567","raw":"10973.06"}}],[{"value":"宁夏回族自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"银川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[宁夏回族自治区].[银川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"27,292.33","type":"DATA_CELL","properties":{"position":"0:568","raw":"27292.328"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"70,607.74","type":"DATA_CELL","properties":{"position":"0:569","raw":"70607.74"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"克拉玛依市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[克拉玛依市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"510.72","type":"DATA_CELL","properties":{"position":"0:570","raw":"510.72"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"克拉玛依市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[克拉玛依市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"白碱滩区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[克拉玛依市].[白碱滩区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"510.72","type":"DATA_CELL","properties":{"position":"0:571","raw":"510.72"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"和田地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[和田地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,236.19","type":"DATA_CELL","properties":{"position":"0:572","raw":"6236.188"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"和田地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[和田地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"和田市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[和田地区].[和田市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,236.19","type":"DATA_CELL","properties":{"position":"0:573","raw":"6236.188"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"喀什地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[喀什地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"15,320.90","type":"DATA_CELL","properties":{"position":"0:574","raw":"15320.9"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"喀什地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[喀什地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"莎车县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[喀什地区].[莎车县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"15,320.90","type":"DATA_CELL","properties":{"position":"0:575","raw":"15320.9"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"巴音郭楞蒙古自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[巴音郭楞蒙古自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,396.50","type":"DATA_CELL","properties":{"position":"0:576","raw":"8396.5"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"巴音郭楞蒙古自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[巴音郭楞蒙古自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"库尔勒市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[巴音郭楞蒙古自治州].[库尔勒市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,396.50","type":"DATA_CELL","properties":{"position":"0:577","raw":"8396.5"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"昌吉回族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[昌吉回族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"7,224.14","type":"DATA_CELL","properties":{"position":"0:578","raw":"7224.14"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"昌吉回族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[昌吉回族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"昌吉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[昌吉回族自治州].[昌吉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,224.14","type":"DATA_CELL","properties":{"position":"0:579","raw":"7224.14"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"石河子市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[石河子市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"11,107.32","type":"DATA_CELL","properties":{"position":"0:580","raw":"11107.32"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阿克苏地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[阿克苏地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"21,811.97","type":"DATA_CELL","properties":{"position":"0:581","raw":"21811.972"}}],[{"value":"新疆维吾尔自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"阿克苏地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[阿克苏地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阿克苏市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[新疆维吾尔自治区].[阿克苏地区].[阿克苏市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"21,811.97","type":"DATA_CELL","properties":{"position":"0:582","raw":"21811.972"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"179,270.03","type":"DATA_CELL","properties":{"position":"0:583","raw":"179270.028"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"兰州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[兰州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"42,543.14","type":"DATA_CELL","properties":{"position":"0:584","raw":"42543.144"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"嘉峪关市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[嘉峪关市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"20,206.93","type":"DATA_CELL","properties":{"position":"0:585","raw":"20206.928"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"平凉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[平凉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"19,133.24","type":"DATA_CELL","properties":{"position":"0:586","raw":"19133.24"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"张掖市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[张掖市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,840.04","type":"DATA_CELL","properties":{"position":"0:587","raw":"6840.036"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白银市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[白银市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"341.04","type":"DATA_CELL","properties":{"position":"0:588","raw":"341.04"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"白银市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[白银市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"白银区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[白银市].[白银区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"341.04","type":"DATA_CELL","properties":{"position":"0:589","raw":"341.04"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"酒泉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[酒泉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"78,771.90","type":"DATA_CELL","properties":{"position":"0:590","raw":"78771.896"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"酒泉市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[酒泉市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"肃州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[酒泉市].[肃州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"78,771.90","type":"DATA_CELL","properties":{"position":"0:591","raw":"78771.896"}}],[{"value":"甘肃省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"金昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[甘肃省].[金昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"11,433.74","type":"DATA_CELL","properties":{"position":"0:592","raw":"11433.744"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"457,957.53","type":"DATA_CELL","properties":{"position":"0:593","raw":"457957.528"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"咸阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[咸阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"48,721.68","type":"DATA_CELL","properties":{"position":"0:594","raw":"48721.68"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"安康市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[安康市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"95.76","type":"DATA_CELL","properties":{"position":"0:595","raw":"95.76"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宝鸡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[宝鸡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,750.98","type":"DATA_CELL","properties":{"position":"0:596","raw":"1750.98"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"榆林市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[榆林市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"42,384.72","type":"DATA_CELL","properties":{"position":"0:597","raw":"42384.72"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汉中市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[汉中市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"52,164.98","type":"DATA_CELL","properties":{"position":"0:598","raw":"52164.98"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"汉中市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[汉中市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"西乡县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[汉中市].[西乡县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"269.36","type":"DATA_CELL","properties":{"position":"0:599","raw":"269.36"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"渭南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[渭南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"66,042.93","type":"DATA_CELL","properties":{"position":"0:600","raw":"66042.928"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"渭南市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[渭南市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"韩城市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[渭南市].[韩城市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,854.30","type":"DATA_CELL","properties":{"position":"0:601","raw":"1854.3"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"西安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[西安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"226,782.64","type":"DATA_CELL","properties":{"position":"0:602","raw":"226782.64"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"西安市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[西安市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"户县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[西安市].[户县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"103.04","type":"DATA_CELL","properties":{"position":"0:603","raw":"103.04"}}],[{"value":"陕西省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铜川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[陕西省].[铜川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"20,013.84","type":"DATA_CELL","properties":{"position":"0:604","raw":"20013.84"}}],[{"value":"青海省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[青海省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"49,863.38","type":"DATA_CELL","properties":{"position":"0:605","raw":"49863.38"}}],[{"value":"青海省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[青海省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"西宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西北].[青海省].[西宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"49,863.38","type":"DATA_CELL","properties":{"position":"0:606","raw":"49863.38"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"262,651.09","type":"DATA_CELL","properties":{"position":"0:607","raw":"262651.088"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大理白族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[大理白族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"3,253.32","type":"DATA_CELL","properties":{"position":"0:608","raw":"3253.32"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"大理白族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[大理白族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"大理市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[大理白族自治州].[大理市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,253.32","type":"DATA_CELL","properties":{"position":"0:609","raw":"3253.32"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"昆明市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[昆明市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"136,537.83","type":"DATA_CELL","properties":{"position":"0:610","raw":"136537.828"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"昭通市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[昭通市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"27,136.42","type":"DATA_CELL","properties":{"position":"0:611","raw":"27136.424"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"曲靖市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[曲靖市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"40,642.64","type":"DATA_CELL","properties":{"position":"0:612","raw":"40642.644"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"玉溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[玉溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"9,164.79","type":"DATA_CELL","properties":{"position":"0:613","raw":"9164.792"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"玉溪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[玉溪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"澄江县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[玉溪市].[澄江县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,816.75","type":"DATA_CELL","properties":{"position":"0:614","raw":"8816.752"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"红河哈尼族彝族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[红河哈尼族彝族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"36,708.00","type":"DATA_CELL","properties":{"position":"0:615","raw":"36708.0"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"红河哈尼族彝族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[红河哈尼族彝族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"开远市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[红河哈尼族彝族自治州].[开远市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,842.72","type":"DATA_CELL","properties":{"position":"0:616","raw":"24842.72"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"红河哈尼族彝族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[红河哈尼族彝族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"弥勒县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[红河哈尼族彝族自治州].[弥勒县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"11,865.28","type":"DATA_CELL","properties":{"position":"0:617","raw":"11865.28"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"西双版纳傣族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[西双版纳傣族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"9,208.08","type":"DATA_CELL","properties":{"position":"0:618","raw":"9208.08"}}],[{"value":"云南省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"西双版纳傣族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[西双版纳傣族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"景洪市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[云南省].[西双版纳傣族自治州].[景洪市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,208.08","type":"DATA_CELL","properties":{"position":"0:619","raw":"9208.08"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"507,053.95","type":"DATA_CELL","properties":{"position":"0:620","raw":"507053.953"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"乐山市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[乐山市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"12,561.89","type":"DATA_CELL","properties":{"position":"0:621","raw":"12561.892"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"内江市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[内江市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"43,502.79","type":"DATA_CELL","properties":{"position":"0:622","raw":"43502.788"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"凉山彝族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[凉山彝族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,679.15","type":"DATA_CELL","properties":{"position":"0:623","raw":"6679.148"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"凉山彝族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[凉山彝族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"西昌市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[凉山彝族自治州].[西昌市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,679.15","type":"DATA_CELL","properties":{"position":"0:624","raw":"6679.148"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南充市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[南充市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"33,509.98","type":"DATA_CELL","properties":{"position":"0:625","raw":"33509.98"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"南充市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[南充市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"阆中市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[南充市].[阆中市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,712.70","type":"DATA_CELL","properties":{"position":"0:626","raw":"9712.696"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宜宾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[宜宾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"24,004.43","type":"DATA_CELL","properties":{"position":"0:627","raw":"24004.428"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"宜宾市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[宜宾市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"宜宾县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[宜宾市].[宜宾县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,004.43","type":"DATA_CELL","properties":{"position":"0:628","raw":"24004.428"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"广元市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[广元市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"38,601.02","type":"DATA_CELL","properties":{"position":"0:629","raw":"38601.024"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"德阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[德阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"17,999.90","type":"DATA_CELL","properties":{"position":"0:630","raw":"17999.898"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"德阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[德阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"中江县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[德阳市].[中江县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"385.14","type":"DATA_CELL","properties":{"position":"0:631","raw":"385.14"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"德阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[德阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"旌阳区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[德阳市].[旌阳区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,791.34","type":"DATA_CELL","properties":{"position":"0:632","raw":"5791.338"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"223,842.45","type":"DATA_CELL","properties":{"position":"0:633","raw":"223842.451"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"双流县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[双流县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,811.32","type":"DATA_CELL","properties":{"position":"0:634","raw":"1811.32"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"大邑县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[大邑县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"66.64","type":"DATA_CELL","properties":{"position":"0:635","raw":"66.64"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"崇州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[崇州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,088.01","type":"DATA_CELL","properties":{"position":"0:636","raw":"3088.008"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"彭州市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[彭州市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,050.42","type":"DATA_CELL","properties":{"position":"0:637","raw":"1050.42"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"成华区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[成华区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,309.14","type":"DATA_CELL","properties":{"position":"0:638","raw":"1309.14"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新津县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[新津县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"2,436.42","type":"DATA_CELL","properties":{"position":"0:639","raw":"2436.42"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"新都区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[新都区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,541.44","type":"DATA_CELL","properties":{"position":"0:640","raw":"3541.44"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"武侯区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[武侯区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"1,923.18","type":"DATA_CELL","properties":{"position":"0:641","raw":"1923.18"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"温江区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[温江区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,368.27","type":"DATA_CELL","properties":{"position":"0:642","raw":"9368.268"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"蒲江县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[蒲江县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"7,611.52","type":"DATA_CELL","properties":{"position":"0:643","raw":"7611.52"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"邛崃市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[邛崃市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"23,546.32","type":"DATA_CELL","properties":{"position":"0:644","raw":"23546.32"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"郫县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[郫县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"959.62","type":"DATA_CELL","properties":{"position":"0:645","raw":"959.616"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"都江堰市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[都江堰市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,765.78","type":"DATA_CELL","properties":{"position":"0:646","raw":"4765.775"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"金堂县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[金堂县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,985.26","type":"DATA_CELL","properties":{"position":"0:647","raw":"4985.26"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"金牛区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[金牛区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"3,254.30","type":"DATA_CELL","properties":{"position":"0:648","raw":"3254.3"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"锦江区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[锦江区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"6,093.67","type":"DATA_CELL","properties":{"position":"0:649","raw":"6093.668"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"青白江区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[青白江区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"14,716.38","type":"DATA_CELL","properties":{"position":"0:650","raw":"14716.38"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"青羊区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[青羊区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,268.28","type":"DATA_CELL","properties":{"position":"0:651","raw":"5268.284"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"成都市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"龙泉驿区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[成都市].[龙泉驿区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"4,270.56","type":"DATA_CELL","properties":{"position":"0:652","raw":"4270.56"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绵阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[绵阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"78,681.85","type":"DATA_CELL","properties":{"position":"0:653","raw":"78681.848"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绵阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[绵阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"三台县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[绵阳市].[三台县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"17,455.12","type":"DATA_CELL","properties":{"position":"0:654","raw":"17455.116"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"绵阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[绵阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"江油市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[绵阳市].[江油市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"25,188.30","type":"DATA_CELL","properties":{"position":"0:655","raw":"25188.296"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"自贡市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[自贡市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"21,681.52","type":"DATA_CELL","properties":{"position":"0:656","raw":"21681.52"}}],[{"value":"四川省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"遂宁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[四川省].[遂宁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"5,988.98","type":"DATA_CELL","properties":{"position":"0:657","raw":"5988.976"}}],[{"value":"西藏自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"10,015.18","type":"DATA_CELL","properties":{"position":"0:658","raw":"10015.18"}}],[{"value":"西藏自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"拉萨市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区].[拉萨市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,436.32","type":"DATA_CELL","properties":{"position":"0:659","raw":"4436.32"}}],[{"value":"西藏自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"那曲地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区].[那曲地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"5,578.86","type":"DATA_CELL","properties":{"position":"0:660","raw":"5578.86"}}],[{"value":"西藏自治区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"那曲地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区].[那曲地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"那曲县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[西藏自治区].[那曲地区].[那曲县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,578.86","type":"DATA_CELL","properties":{"position":"0:661","raw":"5578.86"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"138,037.28","type":"DATA_CELL","properties":{"position":"0:662","raw":"138037.284"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"六盘水市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[六盘水市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"6,516.44","type":"DATA_CELL","properties":{"position":"0:663","raw":"6516.44"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"安顺市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[安顺市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"12,296.90","type":"DATA_CELL","properties":{"position":"0:664","raw":"12296.9"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"小围寨","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[小围寨]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"1,912.96","type":"DATA_CELL","properties":{"position":"0:665","raw":"1912.96"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"毕节地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[毕节地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"15,387.79","type":"DATA_CELL","properties":{"position":"0:666","raw":"15387.792"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"毕节地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[毕节地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"毕节市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[毕节地区].[毕节市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"9,495.95","type":"DATA_CELL","properties":{"position":"0:667","raw":"9495.948"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"毕节地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[毕节地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"金沙县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[毕节地区].[金沙县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,891.84","type":"DATA_CELL","properties":{"position":"0:668","raw":"5891.844"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"贵阳市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[贵阳市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"31,601.70","type":"DATA_CELL","properties":{"position":"0:669","raw":"31601.696"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"遵义市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[遵义市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"32,679.98","type":"DATA_CELL","properties":{"position":"0:670","raw":"32679.976"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"遵义市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[遵义市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"遵义县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[遵义市].[遵义县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"32,679.98","type":"DATA_CELL","properties":{"position":"0:671","raw":"32679.976"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铜仁地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[铜仁地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"29,369.90","type":"DATA_CELL","properties":{"position":"0:672","raw":"29369.9"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铜仁地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[铜仁地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"江口县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[铜仁地区].[江口县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"24,003.84","type":"DATA_CELL","properties":{"position":"0:673","raw":"24003.84"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"铜仁地区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[铜仁地区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"铜仁市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[铜仁地区].[铜仁市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"5,366.06","type":"DATA_CELL","properties":{"position":"0:674","raw":"5366.06"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黔南布依族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[黔南布依族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"8,271.62","type":"DATA_CELL","properties":{"position":"0:675","raw":"8271.62"}}],[{"value":"贵州省","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"黔南布依族苗族自治州","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[黔南布依族苗族自治州]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"都匀市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[贵州省].[黔南布依族苗族自治州].[都匀市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[区县]"}},{"value":"8,271.62","type":"DATA_CELL","properties":{"position":"0:676","raw":"8271.62"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"386,461.57","type":"DATA_CELL","properties":{"position":"0:677","raw":"386461.572"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"万州区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市].[万州区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"16,921.58","type":"DATA_CELL","properties":{"position":"0:678","raw":"16921.576"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"云阳县","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市].[云阳县]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"24,699.64","type":"DATA_CELL","properties":{"position":"0:679","raw":"24699.64"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"北碚区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市].[北碚区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"5,338.06","type":"DATA_CELL","properties":{"position":"0:680","raw":"5338.06"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"合川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市].[合川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"34,747.08","type":"DATA_CELL","properties":{"position":"0:681","raw":"34747.076"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"永川市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市].[永川市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"24,066.22","type":"DATA_CELL","properties":{"position":"0:682","raw":"24066.224"}}],[{"value":"重庆市","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[省]"}},{"value":"涪陵区","type":"ROW_HEADER","properties":{"uniquename":"[地区].[中国].[西南].[重庆市].[涪陵区]","hierarchy":"[地区]","dimension":"地区","level":"[地区].[城市]"}},{"value":"null","type":"ROW_HEADER","properties":{}},{"value":"4,760.25","type":"DATA_CELL","properties":{"position":"0:683","raw":"4760.252"}}]],"rowTotalsLists":null,"colTotalsLists":null,"runtime":184,"error":null,"height":685,"width":4,"query":{"queryModel":{"axes":{"FILTER":{"mdx":null,"filters":[],"sortOrder":null,"sortEvaluationLiteral":null,"hierarchizeMode":null,"location":"FILTER","hierarchies":[],"nonEmpty":false,"aggregators":[]},"COLUMNS":{"mdx":null,"filters":[],"sortOrder":null,"sortEvaluationLiteral":null,"hierarchizeMode":null,"location":"COLUMNS","hierarchies":[],"nonEmpty":true,"aggregators":[]},"ROWS":{"mdx":null,"filters":[],"sortOrder":null,"sortEvaluationLiteral":null,"hierarchizeMode":null,"location":"ROWS","hierarchies":[{"mdx":null,"filters":[],"sortOrder":null,"sortEvaluationLiteral":null,"hierarchizeMode":null,"name":"[地区]","caption":"地区","dimension":"地区","levels":{"城市":{"mdx":null,"filters":[],"name":"城市","caption":"城市","selection":{"type":"INCLUSION","members":[],"parameterName":null},"aggregators":[]},"省":{"mdx":null,"filters":[],"name":"省","caption":"省","selection":{"type":"INCLUSION","members":[],"parameterName":null},"aggregators":[]},"区县":{"mdx":null,"filters":[],"name":"区县","caption":"区县","selection":{"type":"INCLUSION","members":[],"parameterName":null},"aggregators":[]}}}],"nonEmpty":true,"aggregators":[]}},"visualTotals":false,"visualTotalsPattern":null,"lowestLevelsOnly":false,"details":{"axis":"COLUMNS","location":"BOTTOM","measures":[{"name":"销售额","uniqueName":"[Measures].[销售额]","caption":"销售额","type":"EXACT"}]},"calculatedMeasures":[]},"cube":{"uniqueName":"[Mart].[Mart].[Mart].[产品]","name":"产品","connection":"Mart","catalog":"Mart","schema":"Mart","caption":null,"visible":false},"mdx":"WITH\nSET [~ROWS] AS\n    Hierarchize({{[地区].[省].Members}, {[地区].[城市].Members}, {[地区].[区县].Members}})\nSELECT\nNON EMPTY {[Measures].[销售额]} ON COLUMNS,\nNON EMPTY [~ROWS] ON ROWS\nFROM [产品]","name":"0979C819-3B01-1113-82B3-69088F38D13A","parameters":{},"plugins":{},"properties":{"saiku.olap.query.automatic_execution":true,"saiku.olap.query.nonempty":true,"saiku.olap.query.nonempty.rows":true,"saiku.olap.query.nonempty.columns":true,"saiku.ui.render.mode":"table","saiku.olap.query.filter":true,"saiku.olap.result.formatter":"flat","org.saiku.query.explain":true,"org.saiku.connection.scenario":false,"saiku.olap.query.drillthrough":true},"metadata":{},"queryType":"OLAP","type":"QUERYMODEL"},"topOffset":1,"leftOffset":0};

export {drawMapPath, colorHandle, compare, getZoomScale, fillColor, colorMultiple, sizeRange, clickMap,
  drawMultipleMap, drawMultipleChina, colorInfo, titleInfo, clickAxis, drawScatterChina, colorRange,
  drawPrivenceMap, getCenters, clickProvince, drawCoutyMap, clickCouty, dataTips, textContent, drawBubble,
   testdata};