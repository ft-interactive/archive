//*////////////////////////////////////////////////////////////////////////////////////////////*//
//   AUTHOR: BEN FREESE             ///////////////////////////////////////////////////////////
//   DATE: JANUARY 25, 2012        ///////////////////////////////////////////////////////////
//*////////////////////////////////////////////////////////////////////////////////////////////*//

////////////////////////////////////////////////////////////////////////////////////////////////////
//   VARIABLES   ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//   DON'T TOUCH   /////////////////////////////////////////////////////////////////////////////
var browser = $.browser, userDevice, requiredArray = [], supports_SVG = false, supports_Canvas = false, supports_CSS3 = false, dataSet, console;

//   YOUR VARIABLES   /////////////////////////////////////////////////////////////////////////
var preventContentSelection = true;
var dynamicPageFurniture = true;
var required_SVG = true;
var required_Canvas = false;
var required_CSS3 = false; //it's unlikely you'll have to change this to true unless your styling REALLY breaks in IE8/9
var required_Passed = false; //only change this value if you wish to override requirements
var dataURL = ""; //http://network-spreadsheet.herokuapp.com/spreadsheet/tfcMm6fZCc3OBDqUvgVWn3Q/entities; //"http://interactive.ftdata.co.uk/data/ft.interactive.data_v2.php?_cf=226&id=303"; //"https://docs.google.com/spreadsheet/pub?key=0Aq-Knoj398N1dHliZklaRU5DRUNhUGMzRW9CZ1dvSmc&output=html";
var dataType = "interactiveDB"; //googleDrive, interactiveDB, jsonp (heroku)

var exampleImages = [];

var jsonURL = "./components/iframe/json/saudiApr2015b.json";
var treeWidth = 1800, 
	treeHeight = 800, //690 for parentBarShrink = true; //875 for parentBarShrink = false //990 expanded with the newest json
	i = 0, //id # used
	root,
	paddingLeft = 20,
	paddingTop = 20; //up from 15 to add space for timeline at top
var tree;
var diagonal;
var visTop;
var vis;

var verticalOffset = $('.content').offset().top + parseInt($('.content').css("padding-top"));

var infoPaneLeft = $(".infoPane").css("left");

var scaleSpacing = false; //setting this will cause the bars to space out based on the treeHeight
var parentBarShrink = false; //setting this to false will cause the bars to always be underneath each other
var hoverFunctionality = false;
var familyColorAttenuation = true;
var nodeSpacing = 3;
var barHeight = 15;
var textIndent = 10;
var yearToPixel = 6.55; //6.75 is perfect for fullwidth (972px) //6 is default
var n = 9; //timeline - number of date intervals
var dateVals = []; //timeline - first and last value
var currentYear = 2017.2; //need currentYear, theoretically the timeline could incorporate future dates
var showing = [];
var nodesTotal = 0;
var ignoredNodes = 0;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var activeHoverNode = [0]; //for line at beginning
var animSpeed = 0;
var doubleTimeline = true;
var selectLineHeight = 0;
var infoPaneDefaultY = parseFloat($(".infoPane").css("top"));
var legendClickGetHeight = 0;


////////////////////////////////////////////////////////////////////////////////////////////////////
//   SETUP   //////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

$().ready(
	function(){setTimeout(loaded, 100); //slight delay for loading graphic
		function loaded(){setup();}
	}
);

function setup(){
	userDevice = getUserDevice();
       if(preventContentSelection){document.onselectstart = function(){return false;};$('#FTi').css("-moz-user-select", "none");} //prevents Chrome, IE and some webkit browsers from "grabbing" elements such as DIVS and SPANS
	if(browser.msie){browser.type = "Internet Explorer";console = {};console.log = function(t){}}else if(browser.mozilla){browser.type = "FireFox";}else if(navigator.userAgent.toLowerCase().indexOf("chrome") >= 0){browser.type = "Chrome";}else if(browser.opera){browser.type = "Opera"; document.body.onmousedown=function(){return false}}else if(browser.webkit){browser.type = "WebKit";}else{browser.type = "Other";}//alert(browser.type + " (" + browser.version + ")"); //detects browers
	if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){if(userDevice == "computer"){browser.type = "Safari";}};
	if(required_SVG){checkSVG();}if(required_Canvas){checkCanvas();}if(required_CSS3){checkCSS3();}processRequired(requiredArray);if(required_Passed == true){loader();} //if everything checks out, start loader
}

function getUserDevice(){
       var device = "computer";
       var iPad = navigator.userAgent.match(/iPad/i) != null;
       var iPhone = (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
       if(iPad){
              iPhone = false;
              device = "iPad";
       }
       
       if(iPhone){
              device = "iPhone";
       }
       
       return device;
}

function checkSVG(){
	try{
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		supports_SVG = true;
	}catch(e){
	}
	
	if(browser.type == "Safari"){
		supports_SVG = false;
	}
	
	requiredArray.push(["SVG", supports_SVG]);
}

function checkCanvas(){
	if(!!(document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d')) == true){
		supports_Canvas = true;
	}
	requiredArray.push(["Canvas", supports_Canvas]);
}

function checkCSS3(){
	var prevColor = $('body').css("color");
	try{
		$('body').css("color", "rgba(1,5,13,0.44)");
	}catch(e){
	}
	supports_CSS3 = $('body').css("color") != prevColor;
	$('body').css("color", prevColor);
	requiredArray.push(["CSS3", supports_CSS3]);
}

function processRequired(reqs){
	var fails = 0;
	for(var i = 0; i < reqs.length; i++){
		if(reqs[i][1] == false){
			fails++;
		}
	}
	if(fails > 0){
		if(fails > 1){ //FYI: if you are testing from your computer, you will not see an error message due to crossdomain restrictions
			//$.get('http://interactive.ftdata.co.uk/admin/ifIE_Multiple.html', function(data){$('.errorMessage').html(data);});
			$.get('http://interactive.ftdata.co.uk/admin/if_IESAFARI.html', function(data){$('.errorMessage').html(data);}); //safari has some issues with this tree
		}else{
			//$.get('http://interactive.ftdata.co.uk/admin/ifIE_' + reqs[0][0] + '.html', function(data){$('.errorMessage').html(data);});
			$.get('http://interactive.ftdata.co.uk/admin/if_IESAFARI.html', function(data){$('.errorMessage').html(data);}); //safari has some issues with this tree
		}
		
		$('.errorMessageHolder').css("visibility", "visible");
		$('.errorImage').css("visibility", "visible");
		$('.errorMessage').css("visibility", "visible").css("left", "75px").width($('.content').parent().width() - 150);
		$('.errorBground').css({"visibility": "visible"}).height($('body').height()).width($('body').width());
		//$('.errorImage').html('<img src="_media/errorMsg.jpg"/>')
	}else{
		$('.errorMessageHolder').remove();
		required_Passed = true;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//   LOAD RESOURCES   ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function loader(){
	$(".loader").css("visibility", "visible").css("width", 50).css("left", (parseInt($("div").first().width()) / 2) - 25).css("top", ((parseInt($("#footerContents").height()) + parseInt($("#footerContents").offset().top)) / 2) - 24);
	loadData();
}

function loadData(){
	if(dataURL.length > 0){
              if(dataType == "googleDrive"){
                     Tabletop.init({key: dataURL, callback: processData, simpleSheet: true});
              }else if(dataType == "interactiveDB"){                     
                     $.getJSON('http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from xml where url='" + dataURL + "'") + '&format=json&diagnostics=true&callback=?', function(ds){}).success(processData);  
              }else if(dataType == "jsonp"){
                     $.getJSON(dataURL + "?callback=?", function(ds){}).success(processData);
              }else{
                     alert("dataURL: " + dataURL + "has been assigned either an incorrect dataType or no dataType. Please check script.js");
              }
	}else{
		processData(null);
	}
	
	function processData(ds){
              if(dataType == "interactiveDB" && ds != null){
                     dataSet = ds.query.results.dataset;
              }else{
                     dataSet = ds;
              }
		
		//ideally the images are all listed inside the dataset. you simply need to put them into an array and feed it into the preCacheImages function
		//if not, you can make an array variable (exampleImages) and manually list the images before feeding it into the preCacheImages function
		preCacheImages(exampleImages); //if you have no image, simply use preCacheImages();
	}
}

function preCacheImages(a){
	if(a && a.length > 0){
		for(var i = 0; i < a.length; i++){
			$("#precache").append($("<img />").attr({src: a[i],onload: imageCached([i, a.length - 1])}));
		}
	}else{
		imageCached(); //no images needed to cache
	}
}

function imageCached(n){
	if(n == undefined || n[0] == n[1]){
		credits();
	}
}

function credits(){
	if(dataSet && dataSet.pagefurniture.byline){
		if(dataSet.pagefurniture.source){
			$("#source").append(dataSet.pagefurniture.source);
		}else{
			$("#source").remove();
		}
		$("#credits").append(dataSet.pagefurniture.byline);
	}else{
		//manually enter the credits
		$("#source").append('<a href="http://www.washingtoninstitute.org/uploads/Documents/pubs/PolicyFocus96.pdf" target="_blank">Simon Henderson, Washington Institute</a>, <a href="http://www.robertlacey.com/?q=book/inside-kingdom" target="_blank">Robert Lacey: Inside the Kingdom</a>, <a href="http://www.saudiembassy.net/" target="_blank">Embassy of Saudi Arabia</a>');
		$("#credits").append('<a href="http://search.ft.com/search?queryText=%22Katie%20Carnie%22" target="_blank">Katie Carnie</a> and <a href="http://search.ft.com/search?queryText=%22Ben%20Freese%22" target="_blank">Ben Freese</a>');
	}
	
	tree = d3.layout.tree().size([treeHeight - paddingTop, treeWidth]);
	diagonal = d3.svg.diagonal().projection(function(d){return [d.y, d.x];});
	visTop = d3.select(".d3").append("svg:svg")
		.attr("width", treeWidth)
		.attr("height", treeHeight)
	vis = visTop
		.append("svg:g")
		.attr("transform", "translate(" + paddingLeft + "," + paddingTop + ")"); //20 pixels of left-hand margin space, 15 vertical space
	
	init();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//   INIT & FUNCTIONS   ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function init(){
	$('div').first().css("visibility", "visible");
	$(".loader").remove();

	//alert("passed everything");
							
	////////////////////////////////////////////////////////////////////////////////////////////////////									
	// YOUR CODE GOES HERE !!!!				
	////////////////////////////////////////////////////////////////////////////////////////////////////							
	initD3();
}

function initD3(){
	d3.json(jsonURL, function(json){
		root = json;
		root.x0 = paddingTop;
		//root.x0 = treeHeight / 2; //grows out from this position
		root.y0 = 0;
		
		var dates = [root.born, root.died];
		
		function toggleAll(d){	
			if(d.ruleStart == "NA"){
				d.ruleStart = currentYear;
			}
			
			if(d.ruleEnd == "NA"){
				d.ruleEnd = currentYear;
			}
			
			if(d.died == "NA"){
				d.died = currentYear;
			}else if(d.died == currentYear){
				d.died = currentYear - 0.0000001;
			}
			
			if(d.children){
				d.children.forEach(toggleAll);
				toggle(d);
			}
			
			dates.push(d.born);
			dates.push(d.died);
			
			if(scaleSpacing){
				nodesTotal++;
				
				if(d.title=="Wife"){
					ignoredNodes++;
				}
			}
		}

		// Initialize the display to show a few nodes.
		root.children.forEach(toggleAll);
		root.children.forEach(function(d){if(d.title=="Wife"){toggle(d);}else{}}); //show the wives

		toggle(root.children[1]);
		toggle(root.children[4]);
		toggle(root.children[3].children[5]);
		toggle(root.children[3].children[1]);
		toggle(root.children[3].children[2]);
		toggle(root.children[3].children[3]);
		toggle(root.children[3].children[4]);

		update(root);
		
		dates = dates.sort(function(a,b){ //sort value (smallest to largest)
			return a-b;
		});
		
		update(root);
		createTimeline(dates);
		
		if(doubleTimeline){
			createTimeline2(dates);
			createLegend();
		}
	});
}

// BARS ////////////////////////////////////

function update(source) {
	animSpeed = d3.event && d3.event.altKey ? 5000 : 500;
	
	// Compute the new tree layout.
	//var nodes = tree.nodes(root).reverse();
	var nodes = tree.nodes(root);
	
	// Normalize for fixed-depth.
	
	var realI = 0; //this is needed to ignore the "wives" spacing
	
	nodesTotal = nodes.length;
	
	// you need to store the length of all nodes that are NOT Wives, Unsure and 'only childs' of parents (not including King Saud)
	// before the function ---> nodes.forEach(function(d, i){
	// so that things space properly when scaleSpacing = true;
	// otherwise the height of the fraction of the height of those nodes is wasted
	
	/*
	for(var i = 0; i < nodesTotal; i++){
		if(nodes[i].title != "Wife" && nodes[i].title != "Unsure"){
			if(nodes[i].children || nodes[i]._children){
			
			}
		}
	}
	*/

	nodes.forEach(function(d, i){
		d.y = ((d.born - 1876) * yearToPixel); //pixels per year
	
		if(scaleSpacing){
			d.x = (paddingTop / 2) + ((realI * (treeHeight / (nodesTotal - ignoredNodes))) + (barHeight / 2));
			
			if(d.title!="Wife" && d.title!="Unsure"){
				if(d.children && i > 0){
					//console.log("this one has children visible");
					if(parentBarShrink){
						realI--;
					}
				}
			
				realI++;
			}else{
				//var num = d.children ? d.children.length : d._children.length;
				//d.x = paddingTop + ((realI + (num / 2)) * barHeight) + (realI * 3);
			}
		}else{
			d.x = paddingTop + (realI * barHeight) + (realI * nodeSpacing);		
			
			if(d.title!="Wife" && d.title!="Unsure"){
				if(d.children && i > 0){
					//console.log("this one has children visible");
					if(parentBarShrink){
						realI--;
					}
				}
			
				realI++;
			}else{
				var num = d.children ? d.children.length : d._children.length;
				d.x = paddingTop + ((realI + (num / 2)) * barHeight) + (realI * 3);
			}
		}
		
		if(i == 0){
			//alert("moving");
		}
		
		if(activeHoverNode.length > 0){ //this is a hack
			moveBottomTimeline(d.x + paddingTop + barHeight);
		}
	});

	// Update the nodes…
	var node = vis.selectAll("g.node").data(nodes, function(d){
		return d.id || (d.id = ++i);
	});

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("id", function(d){return d.id}).attr("transform", function(d){
		return "translate(" + source.y0 + "," + source.x0 + ")";
	}).on("click", function(d){
		if(userDevice != "iPad" && userDevice != "iPhone"){
			var obj = this;
		
			if(d.title != "Wife"){
				var level = d.depth;
				
				if(d._children || d.children){
					toggle(d); update(d);
				}
					
				if(d.parent){
					if(d.children || d._children){
						if(!d.disable){
							d.disable = true;
						}else{
							d.disable = false;
						}
					}
				}
			}
		}
	}).on("touchend", function(d){
		activeHoverNode = [$(this), d, this.getBoundingClientRect()];
		
		//alert($(this));
		//alert(d);
		//alert(this.getBoundingClientRect());
	
		var obj = this;

		if(d.title != "Wife"){
			var level = d.depth;
			
			if(d._children || d.children){
				toggle(d); update(d);
			}
				
			if(d.parent){
				if(d.children || d._children){
					if(!d.disable){
						d.disable = true;
					}else{
						d.disable = false;
					}
				}
			}
		}
		
		//activeHoverNode = [];
	}).on("mouseover", function(d){
		if(hoverFunctionality && userDevice != "iPad" && userDevice != "iPhone"){
			var theClass = $("." + $(this).attr("class"));
		
			if(d.depth > 0){ //move parent to top
				var theParentNode;
				
				for(var i = 0; i < theClass.length; i++){ //node ids != node dom - loop through all the .nodes and find the node dom that matches the id				
					if(d.parent.id == $($(theClass)[i]).attr("id")){
						theParentNode = i; //match
					}
				}
				
				$(theClass[theParentNode]).moveBottom(); //moveBottom your parent
				moveChildren(d.parent, theClass); //moveBottom all of your siblings
				moveChildren(d, theClass); //moveBottom all of your children
			}

			$(this).moveBottom(); //moveBottom yourself
			
			
		}
		
		if(userDevice != "iPad" && userDevice != "iPhone"){
			activeHoverNode = [$(this), d, this.getBoundingClientRect()];
		}
		//console.log(d3.svg.mouse(this)); //this is d3.mouse(this) in the newest version apparently		
	}).on("mouseout", function(d){
		if(userDevice != "iPad" && userDevice != "iPhone"){
			activeHoverNode = [];
		}
	});
	
	nodeEnter.append("svg:circle")
	.attr("r", function(d){if(d.title == "Wife"){return d.children.length / 10 * (barHeight / 2);}else if(d.title =="Unsure"){return barHeight / 2;}else{return barHeight / 3;}})
	.style("stroke", function(d){return d.color;})
	.style("fill", function(d){ //this radius is the start size of the rectangle after a node is clicked (to expand) - it will animate to a different size                     
		//return d._children ? d.color : colors[1];
		return d.color;
	});
	
	nodeEnter.append("svg:circle")
	.attr("class", "endCircle")
	.attr("r", function(d){if(d.title == "Wife"){return barHeight / 5;}else if(d.title =="Unsure"){return 0;}else{return barHeight / 3;}})
	.style("stroke", function(d){return d.color;})
	.style("fill", function(d){ //this radius is the start size of the rectangle after a node is clicked (to expand) - it will animate to a different size                     
		//return d._children ? d.color : colors[1];
		return d.color;
	});
	
	nodeEnter.append("svg:rect")
	.attr("width", function(d){if(d.title != "Wife" && d.title != "Unsure"){return 1;}else{return 0;}})
	.attr("height", function(d){if(d.title != "Wife" && d.title != "Unsure"){return barHeight;}else{return 0;}})
	//.attr("opacity", .5)
	/*
		
		.style("fill", function(d){ //this radius is the start size of the rectangle after a node is clicked (to expand) - it will animate to a different size
			return d._children ? colors[0] : colors[1];
		});
		
		*/
	.style("stroke", function(d){return d.color;})
	.style("fill", function(d){ //this radius is the start size of the rectangle after a node is clicked (to expand) - it will animate to a different size                     
		//return d._children ? d.color : colors[1];
		return gradientify(d);
	});

	nodeEnter.append("svg:text").attr("class", "linkName").attr("x", function(d){
		//return d.children || d._children ? -10 : 10;
		return textIndent;
	}).attr("dy", barHeight / 4).attr("text-anchor", function(d){
		//return d.children || d._children ? "end" : "start";
		return d.children;
	}).style("fill-opacity", 1e-6);

	// Transition nodes to their new position.
	var nodeUpdate = node.transition().duration(animSpeed).attr("transform", function(d){
		
		//console.log(d.x, d.id, i);
		
		
		var yDest = 10;
		/*
		if(i != d.id){
			yDest = d.x;
		}
		*/
		yDest = d.x;
		//legendClickGetHeight
		
		//console.log(yDest);
		
		if(activeHoverNode.length > 0 && activeHoverNode[0] == 0){ //this is a hack
			moveBottomTimeline(yDest + paddingTop + barHeight);
		}
		
		return "translate(" + d.y + "," + yDest + ")";		
	});

	/*
	nodeUpdate.select("circle").attr("r", 4.5).style("fill", function(d){ //this is the radius of the circle while nothing is happening
		return d._children ? colors[0] : colors[1];
	});
	*/
	
	nodeUpdate.select("rect")
	.attr("width", function(d){if(!d.disable || !parentBarShrink){if(d.title != "Wife" && d.title != "Unsure"){if(d.died > 0){return Math.ceil((d.died - d.born) * yearToPixel);}else{return Math.ceil((currentYear - d.born) * yearToPixel);}}else{return 0;}}else{return 10;}})
	.attr("height", function(d){if(d.title != "Wife" && d.title != "Unsure"){return barHeight;}else{return 0;}})

	.style("fill", function(d){ //this is the radius of the circle while nothing is happening
		//return d._children ? d.color : colors[1];
		//return d.color;
		return gradientify(d);
	})
	
	//.style("fill-opacity", .75)
	.style("stroke-width", 1)
	.style("stroke", function(d){return d.color;})
	.attr("y", -7);
	
	nodeUpdate.select(".endCircle")
	.attr("cx", function(d){if(!d.disable || !parentBarShrink){if(d.title != "Wife" && d.title != "Unsure"){if(d.died > 0){return Math.ceil((d.died - d.born) * yearToPixel);}else{return Math.ceil((currentYear - d.born) * yearToPixel);}}else{return 0;}}else{return 10;}})
	.attr("opacity", function(d){if(d.children || d._children){if(d.title != "Unsure" && "Wife"){return 1;}else{return 0;}}else{return 0;}});

	nodeUpdate.select("text")
	.attr("class", "linkName")
	.style("fill-opacity", 1)
	.style("fill", function(d){
		if(d.title == "Unsure"){
			return d.color;
		}else{
			return "#000000";
		}
	})
	.text(function(d){
		if(!d.disable || !parentBarShrink){
			var z = "";
			/*
			if(d.children){
				z = " - ";
			}else if(d._children){
				z = " + ";
			}
			*/
			
			if(d.title != "Wife"){
				return d.name.replace("[likely]", $(".diamond").text());
			}else{
				return "";
			}
		}else{
			//d.disable = false;
			return "";
		}
	});

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition().duration(animSpeed).attr("transform", function(d){
		return "translate(" + source.y + "," + source.x + ")";
	}).remove();

	//nodeExit.select("circle").attr("r", 1e-6); //this radius is the end size of the circle after a node is clicked (to contract) - it is animated from a different size to this size
	nodeExit.select("rect")
	.attr("width", function(d){return 1;})
	.attr("height", function(d){return barHeight;})
	nodeExit.select("text").style("fill-opacity", 1e-6);
	
	nodeExit.select(".endCircle")
	.attr("cx", function(d){return 1;});

	// Update the links…
	var link = vis.selectAll("path.link").data(tree.links(nodes), function(d){
		//console.log(d.source.children.length);
		return d.target.id;
	})
	.on("mouseover", function(d){
		if(d.source && d.source.depth > 0 && d.source.children.length == 7){
			activeHoverNode = [d];
		}
	})
	.on("mouseout", function(d){
		activeHoverNode = [];
	});

	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g").attr("class", "link")
	.style("stroke", function(d){if(d.source && d.source.depth > 0 && d.source.children.length == 7){return d.source.color;}else if(d.source && d.source.depth == 0 && d.target.children && d.target.children.length == 7){return d.target.color;}else{return "#cec6b9";}})
	.style("stroke-width", function(d){if(d.source && d.source.depth > 0 && d.source.children.length == 7){return 3;}else if(d.source && d.source.depth == 0 && d.target.children && d.target.children.length == 7){return 3;}else{return 1.5;}})
	.attr("d", function(d){
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	}).transition().duration(animSpeed).attr("d", diagonal);

	// Transition links to their new position.
	link.transition().duration(animSpeed).attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition().duration(animSpeed).attr("d", function(d){
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	}).remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d){
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

// Toggle children.
function toggle(d){
	if(d.children){
		d._children = d.children; //hiding
		d.children = null;
		
		//removeFrom(showing, d);
	}else{	
		d.children = d._children; //showing
		d._children = null;
		
		//showing.push(d);
	}
}

function removeFrom(array, what){
	var from = 0;

	for(var i = 0;  i < array.length; i++){
		if(array[i] == what){
			from = i;
		}
	}
	
	if(array.length > 0){
		array.splice(from, 1);
		console.log("removed from array");
	}
}

// TIMELINE ////////////////////////////////////

function createTimeline(v){       
	dateVals.push(v[0], v[v.length- 1]);
	
	var tickHeight = 10;
	var tickTopSpace = 15;
	
	for(var i = 0; i < n + 1; i++){	
		var date = visTop.append("svg:text").attr("class", "dateText")
			.attr("x", ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n))
			.attr("y", tickHeight)
			.attr("font-size", "11px")
			//.attr("pointer-events", "none")
			.text(dateVals[0] + Math.round(((dateVals[1] - dateVals[0])) * (i / n)))
			.style("fill-opacity", 1);
		
		date.attr("x", (date.attr("x") - ($('.dateText')[i].getBoundingClientRect().width / 2)) + paddingLeft - 1);
		
		var tickL = visTop.append("svg:rect").attr("class", "timelineTickL")
			.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1)
			.attr("y", tickTopSpace)
			.attr("width", 1)
			.attr("height", tickHeight)
			.style("fill", "#000000");
			
		if(i < n){
			var tickS = visTop.append("svg:rect").attr("class", "timelineTickS")
				.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n) + ((dateVals[1] - dateVals[0]) * yearToPixel) * (1 / (n * 2))) - 1)
				.attr("y", tickTopSpace + (tickHeight / 2))
				.attr("width", 1)
				.attr("height", tickHeight / 2)
				.style("fill", "#000000");
				
			var horizontalRect = visTop.append("svg:rect").attr("class", "timelineHorizontalRect")
				.attr("width", ((dateVals[1] - dateVals[0]) * yearToPixel * (1 / n)) / 2)
				.attr("y", tickTopSpace + (tickHeight / 2) + 1)
				.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1)
				.attr("height", tickHeight / 2)
				.style("fill", "#000000")
				.style("opacity", .1)
				.style("pointer-events", "none");
		}
	}
	
	var horizontalFill = visTop.append("svg:rect").attr("class", "timelineHorizontalFill")
		.attr("width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1)
		.attr("y", tickTopSpace + (tickHeight / 2) + 1)
		.attr("x", paddingLeft - 1)
		.attr("height", tickHeight / 2)
		.style("fill", "#000000")
		.style("opacity", .1)
		.style("pointer-events", "none");
	
	
	var timelineHorizontalLine = visTop.append("svg:rect").attr("class", "timelineHorizontalLine")
		.attr("width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1)
		.attr("y", tickTopSpace + tickHeight)
		.attr("x", paddingLeft - 1)
		.attr("height", 1)
		.style("fill", "#000000")
		//.style("opacity", .5)
		.style("pointer-events", "none");
	
	if(userDevice != "iPad" && userDevice != "iPhone"){
		var dateLine = visTop.append("svg:rect").attr("class", "dateLine")
			.attr("width", 1)
			.attr("y", paddingTop)
			.attr("x", -1000)
			.attr("height", treeHeight - paddingTop)
			.style("fill", "#000000")
			//.style("opacity", .5)
			.style("pointer-events", "none");
	}else{
		$(".toolTip").remove();
	}
	
	$('svg').bind("mousemove", dateMove).bind("mouseleave", dateMove);
}

function createTimeline2(v){       
	dateVals.push(v[0], v[v.length- 1]);
	
	var tickHeight = 10;
	var tickTopSpace = 15;
	var bottomPart = treeHeight - paddingTop;
	
	//console.log($(".node")[$(".node").length - 1].getBoundingClientRect());
	
	for(var i = 0; i < n + 1; i++){	
		var date = visTop.append("svg:text").attr("class", "dateText2")
			.attr("x", ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n))
			.attr("y", tickHeight + bottomPart + tickTopSpace)
			.attr("font-size", "11px")
			//.attr("pointer-events", "none")
			.text(dateVals[0] + Math.round(((dateVals[1] - dateVals[0])) * (i / n)))
			.style("fill-opacity", 1);
		
		date.attr("x", (date.attr("x") - ($('.dateText')[i].getBoundingClientRect().width / 2)) + paddingLeft - 1);
		
		var tickL = visTop.append("svg:rect").attr("class", "timelineTickL2")
			.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1)
			.attr("y", bottomPart + 1)
			.attr("width", 1)
			.attr("height", tickHeight)
			.style("fill", "#000000");
			
		if(i < n){
			var tickS = visTop.append("svg:rect").attr("class", "timelineTickS2")
				.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n) + ((dateVals[1] - dateVals[0]) * yearToPixel) * (1 / (n * 2))) - 1)
				.attr("y", bottomPart + 1)
				.attr("width", 1)
				.attr("height", tickHeight / 2)
				.style("fill", "#000000");
				
			var horizontalRect = visTop.append("svg:rect").attr("class", "timelineHorizontalRect2")
				.attr("width", ((dateVals[1] - dateVals[0]) * yearToPixel * (1 / n)) / 2)
				.attr("y", bottomPart)
				.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1)
				.attr("height", tickHeight / 2)
				.style("fill", "#000000")
				.style("opacity", .1)
				.style("pointer-events", "none");
		}
	}
	
	var horizontalFill = visTop.append("svg:rect").attr("class", "timelineHorizontalFill2")
		.attr("width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1)
		.attr("y", bottomPart)
		.attr("x", paddingLeft - 1)
		.attr("height", tickHeight / 2)
		.style("fill", "#000000")
		.style("opacity", .1)
		.style("pointer-events", "none");
	
	var timelineHorizontalLine = visTop.append("svg:rect").attr("class", "timelineHorizontalLine2")
		.attr("width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1)
		.attr("y", bottomPart)
		.attr("x", paddingLeft - 1)
		.attr("height", 1)
		.style("fill", "#000000")
		//.style("opacity", .5)
		.style("pointer-events", "none");
}

function createLegend(){
	var bottomPart = treeHeight - paddingTop;

	//$('svg').append('<defs><pattern id="legend1" patternUnits="userSpaceOnUse" width="972" height="86"><image xlink:href="img/saudiLegend.png" x="0" y="0" width="972" height="86" /></pattern></defs>');

	var defs = visTop.append('svg:defs').append('svg:pattern')
		.attr('id', 'legend1')
		.attr('patternUnits', 'objectBoundingBox') //don't use userSpaceOnUse
		.attr('width', 1) //when using userSpaceOnUse, this must be 972
		.attr('height', 1) //when using userSpaceOnUse, this must be 86
		.append('svg:image')
		.attr('xlink:href', 'img/saudiLegendv2.png')
		.attr('x', -18)
		.attr('y', 0)
		.attr('width', 972)
		.attr('height', 86);
	
	var yPos = treeHeight - paddingTop;

	var leg = visTop.append("svg:rect").attr("class", "legend")
		.attr("width", 972)
		.attr("height", 86)
		.attr("y", yPos)
		.attr("x", 0)
		.style("fill", "url(#legend1)")
		//.style("opacity", .5)
		.style("pointer-events", "none");
	/*	
	visTop.append("svg:rect")
		.attr("class", "legendIcon")
		.attr("generation", 1)
		.style("fill", "#000000")
		.style("fill-opacity", 0)
		.style("cursor", "pointer")
		.attr("y", yPos + 58)// yPos + 58;
		.attr("x", 205)		
		.attr("width", 25)
		.attr("height", 12)
		.on("click", function(d){legendClick(this);});
		
	visTop.append("svg:rect")
		.attr("class", "legendIcon")
		.attr("generation", 2)
		.style("fill", "#000000")
		.style("fill-opacity", 0)
		.style("cursor", "pointer")
		.attr("y", yPos + 58)// yPos + 58;
		.attr("x", 275)		
		.attr("width", 25)
		.attr("height", 12)
		.on("click", function(d){legendClick(this);});
		
	visTop.append("svg:rect")
		.attr("class", "legendIcon")
		.attr("generation", 3)
		.style("fill", "#000000")
		.style("fill-opacity", 0)
		.style("cursor", "pointer")
		.attr("y", yPos + 58)// yPos + 58;
		.attr("x", 345)		
		.attr("width", 25)
		.attr("height", 12)
		.on("click", function(d){legendClick(this);});
		
	*/
		
	function legendClick(w){ //this was never finished
		activeHoverNode = []; //needed to prevent CPU from doing the same loop elsewhere
	
		if(d3.select(w).attr("generation") == 1){
			//console.log(1);
			
			if(root.children){
				toggle(root);
				update(root);
				moveBottomTimeline(root.x + paddingTop + barHeight);
			}
		}else if(d3.select(w).attr("generation") == 2){
			//console.log(2);
			if(root.children){
				toggleDSome(root);
				update(root);
				moveBottomTimeline(root.children[root.children.length - 1].x + paddingTop + barHeight);
			}else{
				console.log("everything is minimized");
				toggle(root);
				toggleDSome(root);
				moveBottomTimeline(root.children[root.children.length - 1].x + paddingTop + barHeight);
				update(root);
			}
		}else{
			//console.log(3);	

			if(root.children){
				root.children.forEach(toggleDAll);
				moveBottomTimeline(root.children[root.children.length - 1].x + paddingTop + barHeight);
			}else{
				toggle(root);
				toggleDAll(root);
				moveBottomTimeline(root.children[root.children.length - 1].x + paddingTop + barHeight);
				console.log("everything is minimized");
			}
		}
		
		function toggleDAll(d){				
			if(d.children){
				d.children.forEach(toggleDAll);
				
				if(d.title!="Wife" && d.title!="Unsure"){
					toggle(d);
					update(d);
					
					//moveBottomTimeline(d.x + paddingTop + barHeight);
				}
			}
			
			if(d.title!="Wife" && d.title!="Unsure"){
				toggle(d);
				update(d);
				//moveBottomTimeline(d.x + paddingTop + barHeight);
			}else if(d.title =="Unsure"){
				console.log("unsure2");
				toggle(d);
				update(d);
				d.children.forEach(toggleDAll);
				
				//console.log(d);
			}
		}
		
		function toggleDSome(d){
			//console.log(d);
		
			if(parseInt(d.depth) < 2){
				if(d.children){
					d.children.forEach(toggleDSome);
				}
			}else{
				if(d.children){
					toggle(d);
					//update(d);
				}else{
					
					
					if(d.parent.title != "Wife"){
						toggle(d.parent);
						//update(d.parent);
					}
				}
			}
		}
	}
}

function updateTimeline(){
	var dateTextNode = visTop.selectAll("text.dateText");
	var dateTickLarge = visTop.selectAll("rect.timelineTickL");
	var dateTickSmall = visTop.selectAll("rect.timelineTickS");
	var timelineLine = visTop.selectAll("rect.timelineHorizontalLine");
	var horizontalFill = visTop.selectAll("rect.timelineHorizontalFill");
	var horizontalRect = visTop.selectAll("rect.timelineHorizontalRect");
	
	if(doubleTimeline){
		var dateTextNode2 = visTop.selectAll("text.dateText2");
		var dateTickLarge2 = visTop.selectAll("rect.timelineTickL2");
		var dateTickSmall2 = visTop.selectAll("rect.timelineTickS2");
		var timelineLine2 = visTop.selectAll("rect.timelineHorizontalLine2");
		var horizontalFill2 = visTop.selectAll("rect.timelineHorizontalFill2");
		var horizontalRect2 = visTop.selectAll("rect.timelineHorizontalRect2");
	}
	
	for(var i = 0; i < dateTextNode[0].length; i++){
		//$(dateTextNode[0][i]).attr("x", paddingLeft + (((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - ($(dateTextNode)[0][i].getBoundingClientRect().width / 2) - 1);
		//$(dateTickLarge[0][i]).attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1);
		//$(dateTickSmall[0][i]).attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n) + ((dateVals[1] - dateVals[0]) * yearToPixel) * (1 / (n * 2))) - 1);
		//$(timelineLine[0][i]).attr("width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1);
		//$(horizontalFill[0][i]).attr("width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1);
		
		tween(dateTextNode[0][i], "x", paddingLeft + (((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - ($(dateTextNode)[0][i].getBoundingClientRect().width / 2) - 1);
		tween(dateTickLarge[0][i], "x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1);
		tween(dateTickSmall[0][i], "x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n) + ((dateVals[1] - dateVals[0]) * yearToPixel) * (1 / (n * 2))) - 1);
		tween(timelineLine[0][i], "width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1);
		tween(horizontalFill[0][i], "width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1);
		
		//this one has 2 different things
		d3.select(horizontalRect[0][i])
			.transition()            
			.delay(0)            
			.duration(animSpeed)
			.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1)
			.attr("width", ((dateVals[1] - dateVals[0]) * yearToPixel * (1 / n)) / 2);
			
		if(doubleTimeline){
			tween(dateTextNode2[0][i], "x", paddingLeft + (((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - ($(dateTextNode)[0][i].getBoundingClientRect().width / 2) - 1);
			tween(dateTickLarge2[0][i], "x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1);
			tween(dateTickSmall2[0][i], "x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n) + ((dateVals[1] - dateVals[0]) * yearToPixel) * (1 / (n * 2))) - 1);
			tween(timelineLine2[0][i], "width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1);
			tween(horizontalFill2[0][i], "width", Math.round((dateVals[1] - dateVals[0]) * yearToPixel) + 1);
			
			//this one has 2 different things
			d3.select(horizontalRect2[0][i])
				.transition()            
				.delay(0)            
				.duration(animSpeed)
				.attr("x", Math.round(paddingLeft + ((dateVals[1] - dateVals[0]) * yearToPixel) * (i / n)) - 1)
				.attr("width", ((dateVals[1] - dateVals[0]) * yearToPixel * (1 / n)) / 2);
		}
	}
}

function dateMove(e){
	if(e.type=="mousemove"){
		var year = Math.round((e.pageX / yearToPixel) * 100) / 100;
		
		year += dateVals[0];
		year -= Math.round((paddingLeft / yearToPixel) * 100) / 100;
		
		if(year < dateVals[0]){
			year = dateVals[0];
			e.pageX = paddingLeft;
		}else if(year > currentYear){
			year = currentYear;
			e.pageX = paddingLeft + Math.round((year - dateVals[0]) * yearToPixel);
		}
		
		//console.log(year);
		
		var toolTipWidth =  $(".toolTip").width();
		var toolTipHeight =  $(".toolTip").height();
		
		var toolY = selectLineHeight + verticalOffset > e.pageY + 25 + barHeight ? e.pageY + 25 : verticalOffset + selectLineHeight - barHeight;
		
		$(".dateLine").attr("x", e.pageX - 1); //e.pageX -1 for the browsers that don't support pointer-events = none;
		
		$(".toolTip").css({
			top: (toolY) + "px",
			//left: (e.pageX - Math.floor(toolTipWidth / 2)) + "px"
			left: ((parseInt($('.content').css("padding-left")) + e.pageX - 2)) + "px"
		});
		
		//$(".toolTip").html("<div class='stateName'><b>" + "United States" + "</b>" + "<div style='position:relative; margin-top:2px; width:100%; background:" + "#333" + "'><div style='text-align:center; font-size:32px; font-weight:bold; color:#fff1e0; padding-left:4px; padding-right:4px; text-shadow: -1px 1px 0px #333, 1px -1px 0px #333, 1px 1px 0px #333, -1px -1px 0px #333;'>" + "1,000,000" + "<div style='font-size:12px; line-height:125%; position:relative; top:-2px;'>Residents</div></div>" + "</div>");
		
		//console.log(activeHoverNode[1]);
		
		$(".toolTip").stop().css("opacity", 1);
		$(".dateLine").stop().css("opacity", 1);
		$(".infoPane").css("left", parseInt(infoPaneLeft) + parseInt($('.content').css("padding-left")));
		
		if($(".infoPane").css("opacity") == 1){
			$(".infoPane").stop().show().animate({opacity:0}, 500);
		}
		
		if(activeHoverNode.length == 0 || activeHoverNode[0] == 0){
			$(".dateLine").show();
			//$(".toolTip").html("<div class='stateName'><b>" + monthify(year) + "</b>" + "</div>");
			$(".toolTip").html("<div class='stateName'>" + Math.floor(year) + "</div>");
			$(".dateLine").attr("y", paddingTop).attr("width", 1).attr("height", selectLineHeight).css("opacity", 1);
			$(".toolTipImg").css("left", -1000);
			$(".toolTip").css("opacity", .25).stop().animate({opacity:1}, 1000);
			$(".dateLine").css("opacity", .25).stop().animate({opacity:1}, 1000);
			
			if($(".infoPane").text() == ""){
				$(".infoPane").stop().css("opacity", 0);
			}
		}else if(activeHoverNode[1] && activeHoverNode[1].title == "Unsure"){
			$(".dateLine").hide();
			//$(".toolTip").html("<div class='stateName'><b>" + "expand / collapse" + "</b>" + "</div>");
			$(".toolTip").html("<div class='stateName'><b>" + "Click to expand / collapse" + "</b>" + "</div>");
			
			$(".toolTip").css("top", e.pageY + 25);
			
			//$(".toolTip").html("<div class='stateName'><b>" + "Mother information unknown" + "</b>" + "</div>");
			$(".toolTipImg").css("left", -1000);
		}else if(activeHoverNode[1] && activeHoverNode[1].title == "Wife"){
			$(".dateLine").show();
			$(".dateLine").attr("y", paddingTop).attr("width", 1).attr("height", selectLineHeight).css("opacity", 1);
			if(activeHoverNode[1].name == ""){
				//$(".toolTip").html("<div class='stateName'><b>" + monthify(year) + "</b>" + "</div>");
				$(".toolTip").html("<div class='stateName'>" + Math.floor(year) + "</div>");
				$(".toolTip").css("opacity", .25).stop().animate({opacity:1}, 1000);
				$(".dateLine").css("opacity", .25).stop().animate({opacity:1}, 1000);
			}else{
				if(activeHoverNode[1].nameDetails == ""){
					//$(".toolTip").html("<div class='stateName'><b>" + activeHoverNode[1].name + "</b>" + "</div>");
				}else{
					//$(".toolTip").html("<div class='stateName'><b>" + activeHoverNode[1].name + "</b>" + "</div><div class='hoverDetail' style='font-size:12px'>" + activeHoverNode[1].nameDetails + "</div>");
				}
			}
			$(".toolTipImg").css("left", -1000);
		}else if(activeHoverNode.length == 1){
			$(".dateLine").show();
			$(".toolTip").html("<div class='stateName'><b>" + "Sudairi Seven" + "</b>" + "</div>");
			$(".dateLine").attr("y", paddingTop).attr("width", 1).attr("height", selectLineHeight).css("opacity", 1);
			$(".toolTipImg").css("left", -1000);
		}else{			
			$(".dateLine").hide();
			//$(".dateLine").attr("x", 19);
			$(".toolTip").stop().css("opacity", 0);
			$(".toolTipImg").css("left", -1000);
			
			$(".infoPane").stop().html("<div style='width:100px; height:125px; margin-bottom:2px; margin-left:1px; background-image: url(img/saudis/" + activeHoverNode[1].picture + ")'></div><div class='hoverName' style='font-size:14px;'><b>" + activeHoverNode[1].name.replace("[likely]","") + "</b>" + "</div><div class='hoverDetail'><span class='category'></span>" + activeHoverNode[1].born + " - " + isLiving(activeHoverNode[1].died) + "</div><div style='margin-left:1px; margin-right:1px; margin-top:3px; margin-bottom:3px; height:2px; background:" + activeHoverNode[1].color + "'></div><div class='hoverDetail'>" + "<span class='category'>Title</span><br />" + activeHoverNode[1].title + "</div><div class='spacer'></div>");
			//$(".dateLine").attr("y", activeHoverNode[2].top).attr("width", 3).attr("height", barHeight + 1).css("opacity", .25);
			
			if(activeHoverNode[1].ruleStart < activeHoverNode[1].ruleEnd){
				$(".infoPane").append("<div class='spacer'></div><div class='hoverDetail'><span class='category'>Rule</span><br />" + hasRuled(activeHoverNode[1].ruleStart, activeHoverNode[1].ruleEnd, activeHoverNode[1].died) + "</div>");
			}
			
			if(activeHoverNode[1].bio){
				$(".infoPane").append("<div class='spacer'></div><div class='hoverDetail'><span class='category'>About</span><br />" + activeHoverNode[1].bio + "</div>");
			}
			
			var posY = infoPaneDefaultY;
			var bottomOffset = -2;
			
			if(verticalOffset + activeHoverNode[2].top - (parseFloat($(".infoPane").height()) / 2) < posY){
				posY = infoPaneDefaultY + verticalOffset;
			}else if(verticalOffset + bottomOffset + activeHoverNode[2].top + (parseFloat($(".infoPane").height()) / 2) > parseFloat($('.dateLine').attr("height"))){
				//console.log("too long");
				posY = verticalOffset + parseFloat($('.dateLine').attr("height")) - ((parseFloat($(".infoPane").height()) + bottomOffset));
			}else{
				posY = verticalOffset + activeHoverNode[2].top - (parseFloat($(".infoPane").height()) / 2);
			}
			
			if(posY - verticalOffset < infoPaneDefaultY){
				posY = infoPaneDefaultY + verticalOffset;
			}
			
			$(".infoPane").stop().animate({opacity: 1, top: Math.round(posY)}, 250);
			
			//$(".toolTipImg").empty().css("background-image", "url(img/people/" + activeHoverNode[1].name.split(' ').join('') + ".jpg)").css("width", 60).css("height", 92).css("pointer-events", "none");
		}
	}else{
		//console.log("mouse out");
		$(".dateLine").hide();
		$(".toolTip").css("top", -1000);
	}
}

function moveBottomTimeline(v){
	var dateTextNode2 = visTop.selectAll("text.dateText2");
	var dateTickLarge2 = visTop.selectAll("rect.timelineTickL2");
	var dateTickSmall2 = visTop.selectAll("rect.timelineTickS2");
	var timelineLine2 = visTop.selectAll("rect.timelineHorizontalLine2");
	var horizontalFill2 = visTop.selectAll("rect.timelineHorizontalFill2");
	var horizontalRect2 = visTop.selectAll("rect.timelineHorizontalRect2");
	var dateTextNode = visTop.selectAll("text.dateText");
		
	var tickHeight = 10;
	var tickTopSpace = 15;
	
	for(var i = 0; i < dateTextNode[0].length; i++){
		tween(dateTextNode2[0][i], "y", Math.round(v) + tickHeight + tickTopSpace);
		tween(dateTickLarge2[0][i], "y", Math.round(v) + 1);
		tween(dateTickSmall2[0][i], "y", Math.round(v) + 1);
		tween(horizontalFill2[0][i], "y", Math.round(v));
		tween(horizontalRect2[0][i], "y", Math.round(v));
	}
	
	tween($("rect.timelineHorizontalLine2")[0], "y", Math.round(v));
	tween($("rect.legend")[0], "y", Math.round(v) + 50);
	
	//console.log(Math.round(v));
	
	//console.log($('.legend').attr("height"));
		
	$('.footer').stop().css("width", $($('body').children()[0]).width() + "px").css("position","absolute").animate({top: (Math.round(v) + 50 + parseInt($('.legend').attr("height")) + 10 + parseInt(verticalOffset)) + "px",}, animSpeed, 'easeInOutQuad',function(){});
	

	//$('svg').attr("height", (Math.round(v) + 50 + 86) + "px");
	
	//D3 won't tween all items of class "legendIcon" without specifiying which ones exactly
	tween($(".legendIcon")[0], "y", Math.round(v) + 50 + 58);
	tween($(".legendIcon")[1], "y", Math.round(v) + 50 + 58);
	tween($(".legendIcon")[2], "y", Math.round(v) + 50 + 58);
	
	selectLineHeight = Math.round(v) + 1 - tickTopSpace;
	
	if($($(".dateLine")[0]).css("opacity") == 1){
		tween($(".dateLine")[0], "height", selectLineHeight);
	}
}

// OTHER ////////////////////////////////////

function hasRuled(s,e,a){
	if(e > s){
		if(e < dateVals[1]){
			s = (Math.round(e - s)) + " years " + "(" + s + " - " + e + ")";
		}else{
			s = (Math.round(e - s)) + " years " + "(" + s + " - " + "present" + ")";
		}
	}else{
		if(isLiving(a) != "current" && isLiving(a) != "present"){
			s = "Did not rule";
		}else{
			s = "Eligible to rule";
		}
	}
	
	return s;
}

function isLiving(n){
	if(n == currentYear){
		n = "present"
	}else if(Math.round(n) == currentYear){
		n = currentYear;
	}
	
	return n;
}

function monthify(y){
	var bY = Math.floor(y);
	var m = (((y - bY) * 12) / 12) * 10;
	
	return months[Math.round(m)] + ", " + bY;
}

function gradientify(d){
	var ruleLength = 0;
	var ruleDistance = 0;
	var lifeLengthDistance = 0;
	
	var xcolorOpacity = .4;
	var opacityAdditive = 0;
	var opacityWeight = 0.3; //this is the max amount of influence the opacityAdditive can have over the generations of color

	if(familyColorAttenuation){		
		if(d.depth <= 1){
			opacityAdditive = 1;
		}else{
			if(d.parent.title != "Wife" && d.parent.title != "Unsure"){
				opacityAdditive = d.depth;
			}else{
				opacityAdditive = d.depth - 1;
			}
		}
		
		opacityAdditive = ((1 / opacityAdditive) * opacityWeight);
		xcolorOpacity = 1 - (opacityAdditive + xcolorOpacity);
	}
	
	if(d.ruleStart > 0){
	
		//var va = d.cpStart ? d.cpStart : d.ruleStart;
		var va = d.ruleStart;
	
		if(d.ruleEnd > 0){
			ruleLength = d.ruleEnd - va;
		}else{
			ruleLength = currentYear - va;
		}
	}
	
	if(d.died > 0){
		lifeLengthDistance = (d.died - d.born) * yearToPixel;
	}else{
		lifeLengthDistance = (currentYear - d.born) * yearToPixel;
	}
	
	ruleDistance = yearToPixel * ruleLength;
	
	if($('#gradient' + d.id).length > 0){
		$('#gradient' + d.id).remove(); //remove gradients that already exist - they will be rewritten
	}
	
	if(d.cpStart){
		//console.log("was a crown prince");
	}
	
	if(d.died <=  d.ruleEnd){
		var gradientStartKing = (1 - (ruleDistance / lifeLengthDistance)) * 100;       
		var gradient = vis.append("svg:linearGradient")
		.attr("id", "gradient" + d.id)
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

		if(d.cpStart){
			var princeStart = ((d.cpStart  - d.born) / (lifeLengthDistance / yearToPixel)) * 100;
			
			gradient.append("svg:stop")
			.attr("offset", (princeStart) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff1e0', xcolorOpacity))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (princeStart) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', 0))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (princeStart) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', .67))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (gradientStartKing) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', .67))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (gradientStartKing) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', xcolorOpacity))
			.attr("stop-opacity", 1);
		}
		
		gradient.append("svg:stop")
		.attr("offset", Math.floor(gradientStartKing) + "%")
		.attr("stop-color", $.xcolor.opacity(d.color, '#fff1e0', xcolorOpacity))
		.attr("stop-opacity", 1);

		gradient.append("svg:stop")
		.attr("offset", Math.floor((gradientStartKing + 0.00001)) + "%")
		//.attr("stop-color", "#75a5c2") //blue
		.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', 1))
		.attr("stop-opacity", 1);
		
		return 'url(#gradient' + d.id + ')';
	}else{
		var noRuledBeforeDeath = (d.died - d.ruleEnd) * yearToPixel;
		var gradientStartKing = (1 - ((ruleDistance + noRuledBeforeDeath) / lifeLengthDistance)) * 100; 
		var gradientEndKing = (((d.died - d.born) - (d.died - d.ruleEnd)) / (d.died - d.born)) * 100;
		
		var gradient = vis.append("svg:linearGradient")
		.attr("id", "gradient" + d.id)
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");
		
		if(d.cpStart){
			var princeStart = ((d.cpStart  - d.born) / (lifeLengthDistance / yearToPixel)) * 100;

			gradient.append("svg:stop")
			.attr("offset", (princeStart) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff1e0', xcolorOpacity))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (princeStart) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', 0))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (princeStart) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', .67))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (gradientStartKing) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', .67))
			.attr("stop-opacity", 1);
			
			gradient.append("svg:stop")
			.attr("offset", (gradientStartKing) + "%")
			.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', xcolorOpacity))
			.attr("stop-opacity", 1);
		}
		
		gradient.append("svg:stop")
		.attr("offset", (gradientStartKing) + "%")
		.attr("stop-color", $.xcolor.opacity(d.color, '#fff1e0', xcolorOpacity))
		.attr("stop-opacity", 1);

		gradient.append("svg:stop")
		.attr("offset", (gradientStartKing + 0.00001) + "%")
		//.attr("stop-color", "#75a5c2") //blue
		.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', 1))
		.attr("stop-opacity", 1);
		
		gradient.append("svg:stop")
		.attr("offset", (gradientEndKing) + "%")
		//.attr("stop-color", "#75a5c2") //blue
		.attr("stop-color", $.xcolor.opacity(d.color, '#fff7f0', 1))
		.attr("stop-opacity", 1);
		
		gradient.append("svg:stop")
		.attr("offset", (gradientEndKing + 0.00001) + "%")
		//.attr("stop-color", "#75a5c2") //blue
		.attr("stop-color", $.xcolor.opacity(d.color, '#fff1e0', xcolorOpacity))
		.attr("stop-opacity", 1);     
		
		return 'url(#gradient' + d.id + ')';
	}
}

function tween(object, attributes, values){
	/*
	if(typeof attributes === "string"){
		attributes = [attributes];
		values = [values];
	}
	*/
	//console.log("eassiiinggg");
	
	d3.select(object)
		.transition()            
		.delay(0)            
		.duration(animSpeed)
		.attr(attributes, values);
		//.each("end", animateSecondStep);

}

/*
function tween(object, attributes, values){
	if(){
	
	}

	for(var i = 0; i < attributes.length; i++){	
		d3.select(object)
		.transition()            
		.delay(0)            
		.duration(d3.event && d3.event.altKey ? 5000 : 500)
		.attr(attributes[0], values[0]);
		//.each("end", animateSecondStep);
	}
}*/

// DEBUG ////////////////////////////////////

window.addEventListener("hashchange", hashChange, false);

hashChange();

function hashChange(e){
	if(checkDebug()){
		initDebug();
	}else{
	
	};
}

function initDebug(){
	checkSlider();
	setBarShrink();
}

function setBarShrink(){
	document.URL.indexOf("&parentBarShrink=true") > -1 ? parentBarShrink = true : parentBarShrink = false;
}

function checkDebug(){
	return document.URL.indexOf("?debug=true") > -1 || document.URL.indexOf("#debug=true") > -1 ? true : false;
}

function checkSlider(){
	document.URL.indexOf("&slider=true") > -1 ? $('#slider').css("display", "block") : $('#slider').css("display", "none");
}

function useDefaults(){
	$('#slider').css("display", "none");
	parentBarShrink = false;
}

$('#slider').attr("min", 0).attr("max", n).attr("step", .25).attr("value", yearToPixel).bind("change", 
	function(){
		activeHoverNode = []; //allows the slider to adjust the bottom timeline in the event you haven't moused over any nodes
		yearToPixel = this.value;
		update(root);
		updateTimeline();
		$('#slider').attr("value", yearToPixel);
	}
);

// EXTENDED FUNCTIONS ////////////////////////////////////

//moveUp, moveDown are rendered backwards in D3 SVG render stack:: up is down. down is up.

$.fn.moveUp = function(){
	$.each(this, function(){
		$(this).after($(this).prev());   
	});
};

$.fn.moveDown = function(){
	$.each(this, function(){
		$(this).before($(this).next());   
	});
};

$.fn.moveBottom = function(){
	for(var i = 0; i < $("." + $(this).attr("class")).length; i++){
		$.each(this, function(){
			$(this).before($(this).next());   
		});
	}
}

$.fn.moveTop = function(){
	for(var i = 0; i < $("." + $(this).attr("class")).length; i++){
		$.each(this, function(){
			$(this).after($(this).prev());   
		});
	}
}

function moveChildren(who, theClass){
	if(who.children){ //move children to top
		var childrenArray = [];
		var theChildNode;
		
		for(var i = 0; i < who.children.length; i++){ //get the children ids
			childrenArray.push(who.children[i].id);
		}
		
		//console.log("children ids: " + childrenArray);
		
		findChild();
	}
	
	function findChild(){
		for(var j = 0; j < theClass.length; j++){ //node ids != node dom - loop through all the .nodes and find the node dom that matches the id				
			if(childrenArray[0] == $($(theClass)[j]).attr("id")){
				theChildNode = j;
				//console.log("match!");
			}
		}
		
		$(theClass[theChildNode]).moveBottom();
		
		childrenArray.splice(0, 1);
		if(childrenArray.length > 0){
			findChild();
		}
	}
}