//*////////////////////////////////////////////////////////////////////////////////////////////*//
//   AUTHOR: BEN FREESE             ///////////////////////////////////////////////////////////
//   DATE: JANUARY 25, 2012        ///////////////////////////////////////////////////////////
//*////////////////////////////////////////////////////////////////////////////////////////////*//

////////////////////////////////////////////////////////////////////////////////////////////////////
//   VARIABLES   ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//   DON'T TOUCH   /////////////////////////////////////////////////////////////////////////////
var browser = $.browser, userDevice, requiredArray = [], supports_SVG = false, supports_Media = false, supports_Canvas = false, supports_CSS3 = false, dataSet, console;

//   YOUR VARIABLES   /////////////////////////////////////////////////////////////////////////
var preventContentSelection = true;
var dynamicPageFurniture = true;
var required_SVG = true;
var required_Canvas = false;
var required_Media = true; //for both <audio> and <video> tags
var required_CSS3 = false;
var required_Passed = false; //only change this value if you wish to override requirements
var dataURL = ""; //http://network-spreadsheet.herokuapp.com/spreadsheet/tfcMm6fZCc3OBDqUvgVWn3Q/entities; //"http://interactive.ftdata.co.uk/data/ft.interactive.data_v2.php?_cf=226&id=303"; //"https://docs.google.com/spreadsheet/pub?key=0Aq-Knoj398N1dHliZklaRU5DRUNhUGMzRW9CZ1dvSmc&output=html";
var dataType = "interactiveDB"; //googleDrive, interactiveDB, jsonp (heroku)
var sourceRevealer = false;

var exampleImages = ["img/testImage1.png", "img/testImage2.png", "img/testImage3.png", "img/testImage4.png", "img/globe.png", "img/tb1.jpg", "img/tb2.jpg", "img/tb3.jpg", "img/tb4.jpg"];

////////////////////////////////////////////////////////////////////////////////////////////////////
//   SETUP   //////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

$().ready(
	function(){setTimeout(loaded, 100); //slight delay for loading graphic
		function loaded(){setup();}
	}
);

function setup(){
	userDevice = getUserDevice(); if(userDevice != "computer"){$('.popup').css("background", "rgba(233,222,207,.95)");};
       if(preventContentSelection){document.onselectstart = function(){return false;};$('#FTi').css("-moz-user-select", "none");} //prevents Chrome, IE and some webkit browsers from "grabbing" elements such as DIVS and SPANS
	if(browser.msie){browser.type = "Internet Explorer";$('.popup').css("background", "rgba(233,222,207,.95)");console = {};console.log = function(t){}}else if(browser.mozilla){browser.type = "FireFox";$('.controls').css("width", "970px");$('.time').css("width", "116px");$('.markerHolder').css("top", "-14px");}else if(navigator.userAgent.toLowerCase().indexOf("chrome") >= 0){browser.type = "Chrome";}else if(browser.opera){browser.type = "Opera"; $('.markerHolder').css("top", "-11px"); document.body.onmousedown=function(){return false}}else if(browser.webkit){browser.type = "WebKit";$('.controls').css("width", "970px");}else{browser.type = "Other";}if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){if(userDevice == "computer"){browser.type = "Safari";}};//alert(browser.type + " (" + browser.version + ")"); //detects browers
	if(required_SVG){checkSVG();}if(required_Media){checkMedia();}if(required_Canvas){checkCanvas();}if(required_CSS3){checkCSS3();}processRequired(requiredArray);if(required_Passed == true){loader();} //if everything checks out, start loader
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

function inputType(){
	if(userDevice != "computer"){
		return "touchend";
	}else{
		return "click";
	}
}

function checkSVG(){
	try{
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		supports_SVG = true;
	}catch(e){
	}
	requiredArray.push(["SVG", supports_SVG]);
}

function checkMedia(){
	if( !!(document.createElement('audio').canPlayType) == true && !!document.createElement('video').canPlayType == true){
		supports_Media = true;
	}
	requiredArray.push(["Media", supports_Media]);
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
			$.get('http://interactive.ftdata.co.uk/admin/ifIE_Multiple.html', function(data){$('.errorMessage').html(data);});
		}else{
			$.get('http://interactive.ftdata.co.uk/admin/ifIE_' + reqs[0][0] + '.html', function(data){$('.errorMessage').html(data);});
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
	
	var uPDF = new PDFObject({url: "img/sample.pdf"}).embed("precache");
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
		
		if(sourceRevealer){
			initSourceHandler();
		}
	}else{
		//manually enter the credits
		$("#source").append("FT research");
		$("#credits").append("Ben Freese");
		
		if(sourceRevealer){
			dataSet = {}; dataSet.pagefurniture = {};
		
			dataSet.pagefurniture.source = "FT research, Something else";
			dataSet.pagefurniture.byline = "Ben Freese";
			initSourceHandler();
		}
	}
	
	function removePixelForFF(){
		var val = browser.type == "FireFox" ? 1 : 0;
		
		return val;
	}
	
	function initSourceHandler(){
		$("#source").remove();
		$("#credits").remove();
		$('.footerContents').remove();
		$('.footer').append('<div id="sourceLink" style="position:relative;">&#x25B2; Sources and credits</div>');
		$('#sourceLink').attr("status", "up");
		$('.footer').append("<div id='sourceCreditsMask'></div>");
		$('.footer').bind(inputType(), sourceHandler);
	}
	
	function sourceHandler(e){
		$('.content').unbind(inputType(), forceHideSources);
		
		if($('#sourceLink').html("&#x25B2; Sources and credits").attr("status") != "tweening"){
			if($('#sourceLink').attr("status") == "up"){
				$('#sourceLink').html("&#x25BC; Sources and credits").attr("status", "tweening");
				$('#sourcesCredits').remove();
				$('#sourceCreditsMask').append("<div id='sourcesCredits'></div>");
				
				if(dataSet.pagefurniture.source){
					if(dataSet.pagefurniture.source.indexOf(",") >= 0){
						$('#sourcesCredits').html("<div id='source'><b>Sources:&nbsp;</b>" + dataSet.pagefurniture.source + "</div><div id='credits'><b>Interactive:&nbsp;</b>" + dataSet.pagefurniture.byline + "</div>");
					}else{
						$('#sourcesCredits').html("<div id='source'><b>Source:&nbsp;</b>" + dataSet.pagefurniture.source + "</div><div id='credits'><b>Interactive:&nbsp;</b>" + dataSet.pagefurniture.byline + "</div>");
					}
				}else{
					$('#sourcesCredits').html("<div id='credits'><b>Interactive:&nbsp;</b>" + dataSet.pagefurniture.byline + "</div>");
				}

				$('#sourcesCredits').css("height", $('#sourcesCredits').height() - 3);
				
				$('#sourceCreditsMask').css("height", ($('#sourcesCredits').outerHeight() - removePixelForFF()) + "px").css("top", ((1 + $('.footer').height() + $('#sourceCreditsMask').height()) * -1) + "px").css("position", "relative").css("overflow", "hidden");
				$('#sourcesCredits').css("top", $('#sourceCreditsMask').css("height")).stop().animate(
					{
						top: "0px"
					}, 
					200, 
					function(){
						$('#sourceLink').attr("status", "down");
					}
				);
				
				$('.content').bind(inputType(), forceHideSources);
			}else{
				$('#sourceLink').html("&#x25B2; Sources and credits");
				
				$('#sourcesCredits').stop().animate(
					{
						top: $('#sourcesCredits').outerHeight() + "px"
					}, 
					200, 
					function(){
						$('#sourcesCredits').remove();
						$('#sourceLink').attr("status", "up");
					}
				);
			}
		}
	}
	
	function forceHideSources(e){
		$('.content').unbind(inputType(), forceHideSources);
		$('#sourceLink').attr("status", "down");
		sourceHandler();
	}
	
	init();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//   INIT & FUNCTIONS   ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function init(){										
	////////////////////////////////////////////////////////////////////////////////////////////////////									
	// YOUR CODE GOES HERE !!!!				
	////////////////////////////////////////////////////////////////////////////////////////////////////							
	
	$('body').bind("mousemove", scrubTitlePosition).bind("mouseleave", scrubTitlePosition);
	$(".scrubTime").hide();
	$(".scrubTitle").hide();
	$(".overlay").css("width", $('.controls').width() + 2).css("height", $('.videoContainer').height() + 2); //2pixels of borders
	$('.railContainer')[0].addEventListener("mousewheel", scrollHandler, false);
	$('.railContainer')[0].addEventListener('DOMMouseScroll', scrollHandler, false);
	$('.railContainer').bind("mouseover", scrollBarHandler);
	$('.bufferScreen').css("width", $('.content').parent().width() + "px").css("height", $('.content').height() + "px").css("display", "none");
	$('.enterBtn').bind(inputType(), function(){
		$('.instructionsHolder').animate({
					opacity: 0
				}, 
				500, 
				function(){
					$('.enterBtn').unbind();
					$('.instructionsHolder').remove();
					playVideo();
				}
			);
		}
	);
	
	var testLogVariable = 0;
	var videoPositionArray = []; //retains current and previous video position
	var subtitles = true;
	var chaptersRail = false;
	var progressMarkers = true;
	var progressBar = true;
	var progressTime = true;
	var bufferScreen = true;
	var userActionPausesVideo = true;
	var overlayObjectsOnStage = [];
	var captionData = [
		{word: "Popcorn", start: .2, end: .7, fade: true},
		{word: "is", start: .7, end: .9, fade: true},
		{word: "something", start: .9, end: 1.3, fade: true},
		{word: "you", start: 1.3, end: 1.5, fade: true},
		{word: "put", start: 1.5, end: 1.7, fade: true},
		{word: "in", start: 1.7, end: 2.2, fade: true},
		{word: "the", start: 2.2, end: 2.3, fade: true},
		{word: "microwave.", start: 2.3, end: 4, fade: true},
		{word: "This text stays longer", start: 5, end: 8, fade: true},
		{word: "Transitions for text will come soon", start: 9, end: 15, fade: true}
	];
	
	//reveal, fadein, growin, fadegrowin, shrinkin, fadeshrinkin, none
	
	var interactiveData = [
		{element:"image", url:"testImage1.png", progressMarker: [true, "#75a5c2"], id:"img1", ix:0, railId:1, width:"258px", height:"258px", title:"Chart: 2012 corn production and other things of that nature", animateIn: {action:"growin", duration:2, width:"258px", height:"258px"}, start:16.25, end:25, startX: "left", startY: "center", endX: "center", endY: "center", sendToRail:true, appendToRail:true, isActive:false, func:null},
		{element:"image", url:"testImage2.png", progressMarker: [true, "#75a5c2"], id:"img2", ix:1, railId:2, width:"258px", height:"258px", title:"Timeline: the history of corn: launches carousel", animateIn: {action:"fadein", duration:2, width:"258px", height:"258px"}, start:28, end:36, startX: "center", startY: 340, endX: "center", endY: 340, sendToRail:true, appendToRail:true, isActive:false, func:userInvokeCarousel},
		{element:"image", url:"testImage3.png", progressMarker: [true, "#ac88d5"], id:"img3", ix:2, railId:3, width:"258px", height:"127px", title:"A pie chart: launches PDF", animateIn: {action:"fadegrowin", duration:2, width:"166px", height:"127px"}, start:42, end:50, startX: 550, startY: "center", endX: 550, endY: "center", sendToRail:true, appendToRail:true, isActive:false, func:userInvokeImage},
		{element:"image", url:"testImage4.png", progressMarker: [false, "#75a5c2"], id:"img4", ix:3, railId:null, width:"258px", height:"127px", title:"", animateIn: {action:"reveal", duration:2, width:"166px", height:"127px"}, start:43, end:50, startX: 145, startY: "center", endX: 145, endY: "center", sendToRail:true, appendToRail:false, isActive:false, func:userInvokeImage},
		{element:"image", url:"globe.png", progressMarker: [true, "#75a5c2"], id:"img5", ix:4, railId:4, width:"258px", height:"258px", title:"Globe: launches ring", animateIn: {action:"growin", duration:2, width:"258px", height:"258px"}, start:60, end:70, startX: "center", startY: "center", endX: 140, endY: "center", sendToRail:true, appendToRail:true, isActive:false, func:userInvokeD3},
		{element:"image", url:"globe.png", progressMarker: [true, "#75a5c2"], id:"img6", ix:5, railId:5, width:"125px", height:"125px", title:"Globe: launches globe", animateIn: {action:"growin", duration:2, width:"158px", height:"158px"}, start:104.5, end:120, startX: 145, startY: 80, endX: 145, endY: 80, sendToRail:true, appendToRail:true, isActive:false, func:userInvokeD3Globe},
		{element:"d3", url:createHerePie, progressMarker: [true, "#ac88d5"], id:"d31", ix:6, railId:6, width:"258px", height:"258px", title:"D3 Ring comes in", animateIn: {action:"growin", duration:2, width:"258px", height:"258px"}, start:130, end:150, startX: "center", startY: "center", endX: 140, endY: "center", sendToRail:true, appendToRail:true, isActive:false, func:null},
		{element:"image", url:"testImage2.png", progressMarker: [true, "#75a5c2"], id:"img2", ix:7, railId:7, width:"258px", height:"258px", title:"Timeline: this is another really long title for testing", animateIn: {action:"fadein", duration:2, width:"258px", height:"258px"}, start:368, end:372, startX: "center", startY: 340, endX: "center", endY: 340, sendToRail:true, appendToRail:true, isActive:false, func:userInvokeCarousel}
	];
	
	if(chaptersRail){
		for(var i = 0; i < interactiveData.length; i++){
			//if(interactiveData[i].url.indexOf(".jpg") >= 0 || interactiveData[i].url.indexOf(".png") >= 0 || interactiveData[i].url.indexOf(".bmp") >= 0){
			if(interactiveData[i].element == "image"){
				$(".railDesign").append("<div class='railItemHolderD'>" + 
					"<img id='" + interactiveData[i].id + "rd" + "'src='img/" + interactiveData[i].url + "'/>" +
					"<div class='railItemTitleD'>" + interactiveData[i].title + "</div>" + 
					"<div class='railItemIntBoxD'>" + (i + 1) + "</div>" + 
				"</div>");
				$('#' + interactiveData[i].id + "rd").css("position", "relative").css("opacity", .2);
			}
		}
	}

	var popcorn = Popcorn( "#vid", 
		{
			frameAnimation: true
		}
	)
		.on("timeupdate", function(){	
			if(captionData.length > 0){
				this.emit("frame", captionData);
			}else{
				if(this.currentTime() < this.duration()){
					console.log("not at the end");
				}else{
					console.log("at the end");
				}
			}
		}
	)
		.on("frame", function(data){
			$('.captions').text("");
			popcorn.isPlaying = isPlaying();
			if(bufferScreen){
				buffering();
			}
			
			if(subtitles){
				for(var i = 0; i < data.length; i++){
					if(popcorn.currentTime() >= data[i].start && popcorn.currentTime() < data[i].end){
						if(data[i].fade == true){
							//$('.captions').css("opacity", 0).text(data[i].word).stop().animate({opacity: 1}, 250, function(){});
							$('.captions').html("<span class='captionText'>" + data[i].word + "</span>");
						}else{
							$('.captions').html("<span class='captionText'>" + data[i].word + "</span>");
						}
						
						break;
					}
				}
			}
			
			if(interactiveData.length > 0){
				for(var i = 0; i < interactiveData.length; i++){
					if(popcorn.currentTime() >= interactiveData[i].start && popcorn.currentTime() < interactiveData[i].end){ //time to create and animate in the object
						if(interactiveData[i].isActive != true){
							interactiveData[i].isActive = true;
							//alert("transition image");
							
							//if(interactiveData[i].url.indexOf(".jpg") >= 0 || interactiveData[i].url.indexOf(".png") >= 0 || interactiveData[i].url.indexOf(".bmp") >= 0){
							if(interactiveData[i].element == "image"){
								processImage(interactiveData[i]);
							}else if(interactiveData[i].element == "d3"){
								processD3(interactiveData[i]);
							}
						}else{
							//exists on stage
						}
						
						//break; //this break may need to be removed
					}else if(popcorn.currentTime() >= interactiveData[i].end && !interactiveData[i].isActive && interactiveData[i].appendToRail || popcorn.currentTime() >= interactiveData[i].end && interactiveData[i].appendToRail && !popcorn.isPlaying){ //time to create and place the object in the rail - do this when object doesn't exist and when timeline has moved past end time (to avoid animation)
						//console.log("past it's time, should be in rail");

						//console.log($("#" + interactiveData[i].id).parent().className);
						
						if($("#" + interactiveData[i].id).length > 0 && $("#" + interactiveData[i].id).parent()[0].className == "railItemHolder"){
							//console.log("exists already in rail");
						}else{
							console.log("does not exist in rail");
							
							appendToRail(interactiveData[i]);
							interactiveData[i].isActive = false;
							//consoleLogOnce($("#" + interactiveData[i].id).parent()[0].className);
							
							//console.log(overlayObjectsOnStage.length);
						}
					}else if(interactiveData[i].isActive == true){ //sending to the rail does not get it appended
						if(popcorn.currentTime() >= interactiveData[i].end && interactiveData[i].sendToRail && interactiveData[i].isActive){
							console.log("sending to rail");
							sendToRail(interactiveData[i]);
						}
						
						interactiveData[i].isActive = "inTransition"; //need a third value here besides true and false so it doesn't trigger other functions
					}
				}
			}
			
			if(progressBar){
				if(popcorn.currentTime() > 0){
					$('.progress').css("width", (popcorn.currentTime() / popcorn.duration() * 100) + "%");
					//$('.loaded').attr("title", $('.played').text());
					
					//alert(popcorn.currentTime());
				}else if(popcorn.currentTime() >= popcorn.duration()){
					$('.progress').css("width", "100%");
				}else{
					$('.progress').css("width", 0);
				}
			}
			
			if(progressTime){
				$('.played').text(secondsToTime(popcorn.currentTime()));
				$('.duration').text(secondsToTime(popcorn.duration()));
			}
			
			if(popcorn.currentTime() >= popcorn.duration()){
				pauseVideo();
			}
			
			//console.log(popcorn.buffered().end(0));
		}
	)

	$('.play-pause').bind(inputType(), playPauseHandler);
	$('.loaded').bind(inputType(), scrubHandler).bind("mouseover", scrubHandler);

	checkVideoStream();
	
	function checkVideoStream(){
		console.log("checking video stream");
	
		if(parseInt(popcorn.duration()) > -1){ //video loaded
			console.log("video loaded");
			createMarkers();
			reveal();
		}else{ //hasn't loaded yet
			
			if(userDevice == "computer"){
				setTimeout(function(){checkVideoStream();},1000);
			}else{
				setTimeout(function(){reveal();},5000);
			}
		}
	}
	
	function buffering(){	
		if(popcorn.isBuffered){
			//console.log("it's buffered");
			
			if(popcorn.bufferTryCount > 0){ //empty to the try buffer, the video is playing again
				popcorn.bufferTryCount = 0;
			}
			
			bufferScreen(false);
		}else{
			if(!popcorn.paused()){
				//console.log("buffering & unpaused");
				popcorn.bufferTryCount++;
				
				if(browser.type != "FireFox"){
					if(popcorn.bufferTryCount > 10){ //should try 5 times to play a frame before starting the buffer
						popcorn.bufferTryCount = 0;
						bufferScreen(true);
						$(".scrubTime").hide(); //these two need to be hidden in the event the user happens to have their mouse over them when it buffers
						$(".scrubTitle").hide();
					}
				}
			}
		}
		
		function bufferScreen(show){	
			if(show){
				if($('.bufferScreen').css("display") == "none"){
					$('.bufferScreen').css("display", "table-row");
				}
				
				 //if you want to have some animation on the buffer screen
				/*
				if(popcorn.ticktock % 25 === 0){ //every 25 ticks, do something
					
				}
				*/

			}else{
				$('.bufferScreen').hide();
			}
		}
	}
	
	function createMarkers(){
		if(progressMarkers){
			for(var i = 0; i < interactiveData.length; i++){
				if(interactiveData[i].progressMarker[0]){
					$(".markerHolder").append("<div class='marker' id='" + interactiveData[i].ix + "' style='position:absolute; color:" + interactiveData[i].progressMarker[1] + "; left:" + ((($('.loaded').outerWidth() / popcorn.duration()) * interactiveData[i].start) - 7)  + "px;'>&bull;</div>"); //7 is their width
				}
			}
			
			$('.marker').bind(inputType(), scrubHandler).bind("mouseover", scrubHandler);
		}
	}
	
	function resetScrollContents(){
		for(var i = 0; i < $('.railContainer').children().length; i++){
			$($('.railContainer').children()[i]).css("top", "0px");
		}
	}
	
	function resetNewestScrollContents(){		
		for(var i = 0; i < $('.railContainer').children().length; i++){
			var dest = ($('.railContainer')[0].scrollHeight - $('.railContainer').height()) * -1;
			
			$($('.railContainer').children()[i]).css("top", dest + "px");
		}
	}
	
	function goToNewestScrollContents(){
		console.log($('.railContainer').children().length + " exist");
	
		for(var i = 0; i < $('.railContainer').children().length; i++){
			var dest = ($('.railContainer')[0].scrollHeight - $('.railContainer').height()) * -1;
			
			$($('.railContainer').children()[i])
			.stop()
			.animate(
				{
					top: dest + "px"
				}, 
				500, 
				function(){
				}
			)
		}
		
		if($('.railContainer')[0].scrollHeight > $('.railContainer').height()){
			if($('.railScrollbar').length < 1){
				createScrollbar();
			}
		
			$('.railScrollbar').stop()
			.animate(
				{
					top: (1 + $('.content').position().top + $('.railContainer').height() - $('.railScrollbar').outerHeight()) + "px"
				}, 
				500, 
				function(){
				}
			)
		}else{
			$('.railScrollbar').stop().remove();
		}
	}
	
	function createScrollbar(){
		$('.content').append("<div class='railScrollbar'><div id='railScrollUp' class='railArrow' style='top:4px;'>&#9650;</div><div id='railScrollDown' class='railArrow'>&#9660;</div></div>");
		$('.railScrollbar').css("left", ($('.railContainer').position().left - $('.railScrollbar').outerWidth() - 2) + "px");
		$('#railScrollDown').css("top", ($('.railScrollbar').height() - (($('#railScrollUp').height() * 2) + 4)) + "px");
		$('.railScrollbar').bind("mousedown", function(e){
			e.preventDefault(); //specifically to prevent arrows from being selected in FireFox
			
			var handleClickPos = e.offsetY;
			
			if(browser.type == "FireFox"){
				handleClickPos = e.pageY - $('.railScrollbar').position().top;
			}
			
			$(document).bind("mousemove", function(e){
				if(e.pageY < $('.videoContainer').position().top + (handleClickPos +1)){
					e.pageY = $('.videoContainer').position().top + (handleClickPos + 1);
				}else if(e.pageY > $('.videoContainer').outerHeight() + $('.videoContainer').position().top + (handleClickPos - 1) - $('.railScrollbar').outerHeight()){
					e.pageY = $('.videoContainer').outerHeight() + $('.videoContainer').position().top + (handleClickPos - 1) - $('.railScrollbar').outerHeight();
				}else{
					
				}
				
				var percent = (e.pageY - ($('.videoContainer').position().top + (handleClickPos + 1))) / ($('.videoContainer').outerHeight() - $('.railScrollbar').outerHeight() - 2);
				
				$('.railScrollbar').css("top", (e.pageY - handleClickPos) + "px");
				$('.railItemHolder').css("top", (percent * ((2 + $('.railContainer')[0].scrollHeight - $('.videoContainer').outerHeight()) * -1)) + "px");							
			});
			
			$(document).bind("mouseup", function(e){
				$(document).unbind("mouseup").unbind("mousemove");
			});
		});
		
		
		var percentToBottom = ($($('.railContainer').children()[0]).position().top * -1) / ($('.railScrollbar')[0].scrollHeight - $('.railContainer').height());

		$('.railScrollbar').css("top", ((($('.railContainer').height() - $('.railScrollbar').outerHeight()) * percentToBottom) + $('.content').position().top + 1) + "px");
	}
	
	function scrollHandler(e){
		var delta = 0;
		var dest = 0;
		
		if(e.wheelDelta){
			delta = e.wheelDelta;
		}else if(e.detail){
			delta = -e.detail;
		}
		
		if(delta > 0){
			delta = 1;
		}else if(delta < 0){
			delta = -1;
		}
		
		delta *= 50; //100 pixel movement
		
		var posPrev = $($(this).children()[0]).css("top");
			if(posPrev == "auto"){
				posPrev = 0;
			}else{
				posPrev = parseInt(posPrev);
			}
			
			if(posPrev + delta > 0){
				dest = 0;
			}else if(posPrev + delta < ($(this)[0].scrollHeight - $(this).height()) * -1){
				dest = ($(this)[0].scrollHeight - $(this).height()) * -1;
			}else{
				dest = posPrev + delta;
			}
			//console.log($(this)[0].scrollHeight); // - height of all the contents - is this reliable?
			//console.log($(this).height()); //394px - height of the viewable contents
		
		for(var i = 0; i < $(this).children().length; i++){
			$($(this).children()[i]).css("top", dest + "px");
		}
		
		$('.railDesign').scrollTop($(this).scrollTop());
		
		var percentToBottom = ($($('.railContainer').children()[0]).position().top * -1) / ($(this)[0].scrollHeight - $('.railContainer').height());
		
		$('.railScrollbar').stop().css("top", ((($('.railContainer').height() - $('.railScrollbar').outerHeight()) * percentToBottom) + $('.content').position().top + 1) + "px");
	}
	
	function scrollBarHandler(e){
		if(userDevice == "computer"){
			if(e.type=="mouseover"){
				if($('.railContainer')[0].scrollHeight > $(this).height()){
					if($('.railScrollbar').length < 1){
						createScrollbar();
					}
				}else{
					console.log("not enough stuff in here");
				}
			}
		}
	}
	
	function playPauseHandler(e){
		if($('.play.btn-state').css("display") == "block"){
			playVideo();
		}else{
			pauseVideo();
		}
	}
	
	function playVideo(){
		popcorn.play();
		$('.play.btn-state').css("display", "none");
		$('.pause.btn-state').css("display", "block");
		//console.log(popcorn.buffered().end(0));
	}
	
	function pauseVideo(){
		popcorn.pause();
		$('.play.btn-state').css("display", "block");
		$('.pause.btn-state').css("display", "none");
	}
	
	function seekVideo(seconds){
		if(seconds - popcorn.currentTime() > 1 || popcorn.currentTime() - seconds > 1){ //don't seek if trying to seek less than a second into the past or future
			videoPositionArray = [];
			//resetScrollContents(); //this is needed for the new scrolling way
			popcorn.play(seconds);
			
			console.log("seeking backwards");
			
			if($('.play.btn-state').css("display") == "block"){ //if it's paused, when you seek, it should be paused
				pauseVideo();
			}
		}
	}
	
	function scrubHandler(e){	
		if(e.type != "mouseover"){
			var destination = (e.offsetX==undefined) ? e.originalEvent.layerX / $(this).width() * popcorn.duration() : e.offsetX / $(this).width() * popcorn.duration(); //e.offsetX //does not work in FireFox, can use e.originalEvent.layerX instead
			
			if($(this).attr("class") != "marker"){
				if(e.type != "click"){				
					destination = (e.originalEvent.changedTouches[0].pageX - $('.loaded').offset().left) / $(this).width() * popcorn.duration();			
				}
			}else{			
				destination = interactiveData[this.id].start - .0001;
			}

			seekVideo(destination);
			removeUnusedStageObjects();
		}else{
			if(userDevice == "computer"){
				if($(this).attr("class") != "marker"){
					$('.loaded').bind("mousemove", function(ev){
						var destination = (ev.offsetX==undefined) ? ev.originalEvent.layerX / $(this).width() * popcorn.duration() : ev.offsetX / $(this).width() * popcorn.duration();
						$(".scrubTime").show().text(secondsToTime(destination));
					});
					
					$('.loaded').bind("mouseout", function(){
						$('.loaded').unbind("mousemove").unbind("mouseout");
						$(".scrubTime").css("top", -1000).hide();
					});
				}else{
					$(".scrubTitle").css("background", interactiveData[this.id].progressMarker[1]).show().html("<div>" + interactiveData[this.id].title + "</div><div class='arrowDown" + interactiveData[this.id].progressMarker[1].replace("#","") + "'></div>");
					$('.marker').bind("mouseout", function(){
						$('.marker').unbind("mouseout");
						$(".scrubTime").css("top", -1000).hide();
						$(".scrubTitle").css("top", -1000).hide();
					});
				}
			}
		}
	}
	
	function scrubTitlePosition(e){
		var scrubTimeWidth =  parseInt($(".scrubTime").width());
		var scrubTimeHeight =  parseInt($(".scrubTime").height());
		var scrubTitleWidth =  parseInt($(".scrubTitle").width());
		var scrubTitleHeight =  parseInt($(".scrubTitle").height());
		
		$(".scrubTime").css("top", $('.loaded').offset().top - 38).css("left", e.pageX - ((scrubTimeWidth / 2)) - 7);
		$(".scrubTitle").css("top", $('.loaded').offset().top - 40).css("left", e.pageX - ((scrubTitleWidth / 2)) - 7);
		
		if(e.pageX - ((scrubTitleWidth / 2)) - 4 < 0){
			$(".scrubTitle").css("left", "-1px");
			$($($(".scrubTitle")[0]).children()[1]).css("padding-right", "0px").css("text-align", "left").css("left", (e.pageX - 14) + "px");
		}else if(e.pageX + ((scrubTitleWidth / 2)) + 4 > $('.content').width()){			
			$(".scrubTitle").css("left", ($('.controls').width() - scrubTitleWidth - 14) + "px");
			$($($(".scrubTitle")[0]).children()[1]).css("padding-right", "0px").css("text-align", "left").css("left", (e.pageX - $(".scrubTitle").position().left - 14) + "px"); //172px
		}else{
			if(browser.type != "Opera" && browser.type != "Internet Explorer"){
				$($($(".scrubTitle")[0]).children()[1]).css("padding-right", "15px").css("text-align", "center").css("left", "");
			}else{
				$($($(".scrubTitle")[0]).children()[1]).css("padding-right", "0px").css("text-align", "center").css("left", (($($(".scrubTitle")[0]).width() / 2) - 8) + "px");
			}
		}
	}
	
	function secondsToTime(d){
		d = parseFloat(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
		//return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "0") + m + ":" : "00:") + (s < 10 ? "0" : "") + s); //double zeros for minutes
	}
	
	function processImage(object){
		//alert("processing image");
		$('#' + object.id).stop().remove();
		
		if(!existsInOverlayArray(object)){
			overlayObjectsOnStage.push(object);
			//console.log("1: didn't find a duplicate: adding to array");
		}

		$(".overlay").append("<img id='" + object.id + "'src='img/" + object.url + "' style='opacity:0;'/>");
		
		//animateIn: {action:"reveal", duration:2}

		//alert(object.animateIn.action);
		//types: reveal, fadein, growin, fadegrowin, shrinkin, fadeshrinkin, none
		console.log(object.animateIn.action);
		
		var speed = popcorn.currentTime() > object.start + 1 ? 0 : ((object.start + 1) - popcorn.currentTime()) * (object.animateIn.duration * 1000);
		
		switch(object.animateIn.action){
			case "reveal":
				
				$('#' + object.id).css("opacity", .9).css("width", "1px").css("height", "1px")
				
				break;
			case "fadein":
				
				break;
			case "growin":
				
				$('#' + object.id).css("opacity", .9).css("width", "1px").css("height", "1px")
				
				break;
			case "fadegrowin":
				
				$('#' + object.id).css("width", "1px").css("height", "1px")
				
				break;
			case "shrinkin":
				
				$('#' + object.id).css("opacity", .9).css("width", "1px").css("height", "1px")
				
				break;
			case "none":
				
				$('#' + object.id).css("opacity", .9)
				
				break;
			default:
				alert("'" + object.animateIn.action + "'" + " is not a valid animateIn action");
				$('#' + object.id).css("opacity", .9)
				
				break;
		}
		
		$('#' + object.id)
			.css("position", "absolute")
			.css("left", stagePosition(object.startX, "x"))
			.css("top", stagePosition(object.startY, "y"))
			.css("cursor", handleTranslator(object.func) == userInvokeNone ? "default" : "pointer")
			.stop()
			.animate(
				{
					opacity: .9,
					width: object.animateIn.width, 
					height: object.animateIn.height,
					left: parseFloat(stagePosition(object.endX, "x")) - (parseFloat(object.animateIn.width) / 2),
					top: parseFloat(stagePosition(object.endY, "y")) - (parseFloat(object.animateIn.height) / 2)
				}, 
				speed, 
			function(){
			}
		).bind(inputType(), object, handleTranslator(object.func));
	}
	
	function processD3(object){
		$('#' + object.id).stop().remove();
		
		if(!existsInOverlayArray(object)){
			overlayObjectsOnStage.push(object);
			//console.log("1: didn't find a duplicate: adding to array");
		}
		
		var speed = popcorn.currentTime() > object.start + 1 ? 0 : ((object.start + 1) - popcorn.currentTime()) * 1000;

		$(".overlay").append("<div id='" + object.id + "'></div>");
		object.url("#" + object.id);
		$('#' + object.id)
			.css("position", "absolute")
			.css("opacity", .9)
			.css("left", stagePosition(object.startX, "x"))
			.css("top", stagePosition(object.startY, "y"))
			.css("width", "1px")
			.css("height", "1px")
			.css("cursor", handleTranslator(object.func) == userInvokeNone ? "default" : "pointer")
			.stop()
			.animate(
				{
					width: object.width, 
					height: object.height,
					left: parseFloat(stagePosition(object.endX, "x")) - (parseFloat(object.width) / 2),
					top: parseFloat(stagePosition(object.endY, "y")) - (parseFloat(object.height) / 2)
				}, 
				speed, 
			function(){
			}
		).bind(inputType(), object, handleTranslator(object.func));
	}
	
	function stagePosition(p, d){	
		if($.type(p) == "string"){		
			if(p == "center"){
				if(d == "x"){
					p = $('.videoContainer').width() / 2;
				}else{
					p = $('.videoContainer').height() / 2;
				}
			}else if(p == "left" && d == "x"){
				p = 0;
			}else if(p == "right" && d == "x"){
				p = $('.videoContainer').width();
			}else{
				
			}
			
			p += "px";
		}
	
		return p;
	}
	
	function sendToRail(object){
		var dest = 1;
		
		if($('.railContainer').children().length > 0){
			dest = $($('.railContainer').children()[$('.railContainer').children().length - 1]).position().top + $($('.railContainer').children()[$('.railContainer').children().length - 1]).height();
			dest += "px";
		}
	
		$('#' + object.id).stop().animate({left: $('.railContainer').offset().left + "px", width: object.width, height: object.height}, 500, 
			function(){
				if(object.appendToRail){
					$('#' + object.id).stop().animate(
							{
								opacity: 1,
								top: dest //this will eventually be the position of the last item in the railContainer
							}, 500, 
						function(){
							object.isActive = false;
						}
					);
				}else{
					object.isActive = false;
					console.log("removing active object");
					removeActiveObject(object); //this is needed - using removeUnusedObject() instead will cause it to not be removed from overlayObjectsOnStage
				}
			}
		);
	}
	
	function appendToRail(object){
		$('#' + object.id).stop().remove();
		if(object.element == "image"){
			$(".overlay").append("<img id='" + object.id + "'src='img/" + object.url + "'/>");
		}else if(object.element == "d3"){
			$(".overlay").append("<div id='" + object.id + "'></div>");
			object.url("#" + object.id);
		}
		
		$('#' + object.id).css("position", "relative").css("width", object.width).css("height", object.height).css("left", "").css("top", "").attr("class", "railItem");
		
		$(".railContainer")
			.append("<div class='railItemHolder' style='height:" + object.height + ";'>" + 
				"<div class='railItemTitle'>" + object.title + "</div>" + 
				"<div class='railItemIntBox'>" + (object.railId) + "</div>" + 
			"</div>");
	
		$($('.railItemHolder')[$('.railItemHolder').length - 1]).prepend($('#' + object.id));
		goToNewestScrollContents(); //auto-scroll to newest added
		
		$('#' + object.id).bind(inputType(), object, handleTranslator(object.func));
		
		if(!existsInOverlayArray(object)){
			overlayObjectsOnStage.push(object); //check to make sure this isn't making a duplicate
			console.log("2: didn't find a duplicate: adding to array");
		}
	}
	
	function appendAsActive(object){
		$('#' + object.id).stop().remove();
		$(".railContainer").append("<img id='" + object.id + "'src='img/" + object.url + "'/>");
		$('#' + object.id).css("position", "relative").css("width", object.width).css("height", object.height).css("left", "").css("top", "").attr("class", "railItem");
		overlayObjectsOnStage.push(object); //check to make sure this isn't making a duplicate
	}
	
	function removeUnusedStageObjects(){		
		var before = overlayObjectsOnStage.length;
		
		for(var i = 0; i < overlayObjectsOnStage.length; i++){
			removeUnusedObject(i);
		}

		var after = overlayObjectsOnStage.length;
		
		if(before != after){ //this is required for jumping back in time more than 1 object
			removeUnusedStageObjects();
		}
		
		goToNewestScrollContents(); //stuff has been removed, animate the rail content into place
	}
	
	function removeUnusedObject(oid){	
		if(overlayObjectsOnStage[oid].start > popcorn.currentTime()){		
			var pr = $('#' + overlayObjectsOnStage[oid].id).parent()[0];
			$('#' + overlayObjectsOnStage[oid].id).stop().remove();
			
			if($(pr).attr("class") == "railItemHolder"){
				$(pr).remove();
			}
			overlayObjectsOnStage.splice(oid, 1);
		}else if(overlayObjectsOnStage[oid].end > popcorn.currentTime()){
			//alert("remove the parent container");
			
			var pr = $('#' + overlayObjectsOnStage[oid].id).parent()[0];
			if($(pr).attr("class") == "railItemHolder"){
				$(pr).remove();
			}
		}
	}
	
	function removeActiveObject(o){
		var where;
		
		for(var i = 0; i < overlayObjectsOnStage.length; i++){
			if(o.id == overlayObjectsOnStage[i].id){
				where = i;
				break;
			}
		}	
	
		$('#' + o.id).stop().remove();

		if(where != undefined){
			overlayObjectsOnStage.splice(where, 1);
		}
	}
	
	function existsInOverlayArray(o){
		var exists = false;
		for(var i = 0; i < overlayObjectsOnStage.length; i++){
			if(o.id == overlayObjectsOnStage[i].id){
				//console.log("already exists, not adding to array");
				exists = true;
				break;
			}
		}
		
		return exists;
	}
	
	function isPlaying(){
		var s = true;
		
		if(videoPositionArray.length > 2){
			videoPositionArray.shift();
		}
		
		if(popcorn.currentTime() > 0){
			videoPositionArray.push(popcorn.currentTime());
		}

		if(videoPositionArray[0] >= videoPositionArray[1] && browser.type != "FireFox"|| videoPositionArray.length < 2){ //FF times are too similar, so they often get intepretted as the same
			s = false;
			popcorn.isBuffered = false;
		}else{
			popcorn.isBuffered = true;
		}
	
		if(popcorn.ticktock == undefined){
			popcorn.ticktock = 1;
			popcorn.bufferTryCount = 0;
		}else{
			popcorn.ticktock++;
		}
		
		return s;
	}
	
	function handleTranslator(f){
		if(f == undefined || f == null){
			f = userInvokeNone;
		}
		
		return f;
	}
	
	function userInvokeNone(){
		console.log("no function tied to this object");
	}
	
	function userInvokeImage(e){
		//e is the event, e.data is the object	
		displayOverlay(e.currentTarget, e.data);
	}
	
	function userInvokeCarousel(e){
		//e is the event, e.data is the object	
		displayOverlay(e.currentTarget, e.data);
	}
	
	function userInvokeD3(e){
		//e is the event, e.data is the object	
		displayOverlay(e.currentTarget, e.data);
	}
	
	function userInvokeD3Globe(e){
		//e is the event, e.data is the object	
		displayOverlay(e.currentTarget, e.data);
	}
	
	function displayOverlay(t, o){
		if(userActionPausesVideo){
			pauseVideo();
		}
	
		//$('.popup').css("display", "block").css("width", ($('.content').width() - 2) + "px").css("height", $('#vid').css("height"));
		//$('.popup').css("display", "block").css("width", "1px").css("height", "1px").css("top", ((parseInt($('.videoContainer').height()) / 2) + parseInt($('.videoContainer').position().top)) + "px").css("left", (parseInt($('.content').width() - 2) / 2) + "px");
		
		if($($(t).parent()[0]).attr("class") == "overlay"){
			$('.popup').css("display", "block").css("width", "1px").css("height", "1px").css("top", (($(t).outerHeight() / 2) + $('.videoContainer').position().top + $(t).position().top) + "px").css("left", ($(t).position().left + ($(t).outerWidth() / 2)) + "px");	
		}else{		
			$('.popup').css("display", "block").css("width", "1px").css("height", "1px").css("top", ($(t).offset().top + ($(t).height() / 2)) + "px").css("left", (($('.railItemHolder').offset().left + ($('.railItemHolder').width() / 2))) + "px");
		}
		
		
		$('.popup').stop().empty().append("<div class ='close'>&times;</div>")
		.animate(
			{
				top:$('.videoContainer').position().top,
				left:"0px",
				width: ($('.content').width() - 2) + "px",
				height: $('#vid').css("height")
			}, 
			500, 
			function(){
				$($('.close')[0]).bind(inputType(), hidePopup);
				
				switch(o.func){
					case userInvokeCarousel:
						createCarousel();
						break;
					case userInvokeImage:
						createPDF();
						break;
					case userInvokeD3:
						createPie();
						break;
					case userInvokeD3Globe:
						initGlobe();
						break;
					default:
						
						break;
				}
			}
		)

		function hidePopup(){
			$('.popup.close').unbind();
			$('.popup')
			.stop()
			.animate(
				{
					opacity:0
				}, 
				250, 
				function(){
					$('.popup').css("display", "none").css("opacity", 1);
					//console.log("removed popup");
					if(!popcorn.isPlaying){
						playVideo();
					}
				}
			)
		}
	}
	
	function createPDF(){
		$('.popup').append("<div id='pdfViewer' style='opacity:0; width:935px; height:394px;'></div>");
		var success = new PDFObject({url: "img/sample.pdf"}).embed("pdfViewer");
		
		$('#pdfViewer').stop().animate({opacity: 1}, 
			250, function(){}
		)
	}
	
	function createCarousel(){
		$('.popup').append(
			"<div id='carousel' style='opacity:0; padding-top:35px; position:relative; left:20px;'>" + 
				"<div style='table-row; height:325px;'>" + 
					"<div id='leftArrow' class='arrow' style='display:table-cell; vertical-align: middle; width:60px; height:300px; text-align:center;'>&lsaquo;</div>" + 
					
					"<div style='display:table-cell; width:807px;'>" + 
					
						"<div id='carouselHolder' tweening='false' style='width:807px; overflow:hidden;'>" + 
						
							
							carouselContents()
						
							+ 
						
						"</div>" + 
					
					"</div>" + 
					
					"<div id='rightArrow' class='arrow' style='display:table-cell; vertical-align: middle; width:60px; height:300px; text-align:center;'>&rsaquo;</div>" + 
				"</div>" + 
			"</div>"
		);
		
		$('.arrow').bind(inputType(), carouselNav);
		$('#carousel').stop().animate({opacity: 1}, 
			250, function(){}
		)
		
		function carouselContents(){
			if(browser.type != "FireFox" && browser.type != "Internet Explorer"){
				var ret = 
				"<div class='carouselItem' style='display:table-cell; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb1.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A tobacco field in North Carolina</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>" + 
				
				"<div class='carouselItem' style='display:table-cell; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb2.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A cotton plant shot on dirty film</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>" + 
				
				"<div class='carouselItem' style='display:table-cell; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb3.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A corn field near Des Moines, Iowa</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>" + 
				
				"<div class='carouselItem' style='display:table-cell; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb4.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>Oklahoma red winter wheat</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>"+ 
				
				"<div class='carouselItem' style='display:table-cell; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb1.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A tobacco field in North Carolina</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>";
			}else{
				ret = 
				"<div class='carouselItem' style='display:inline-block; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb1.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A tobacco field in North Carolina</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>" + 
				
				"<div class='carouselItem' style='display:inline-block; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb2.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A cotton plant shot on dirty film</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>" + 
				
				"<div class='carouselItem' style='display:inline-block; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb3.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A corn field near Des Moines, Iowa</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>" + 
				
				"<div class='carouselItem' style='display:inline-block; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb4.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>Oklahoma red winter wheat</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>"+ 
				
				"<div class='carouselItem' style='display:inline-block; width:807px; position:relative; padding-right:35px; overflow:hidden;'>" + 
					"<div style='padding-bottom:12px;'><img class='rectInsetBevel' src='img/tb1.jpg' /></div>" + 
					"<div style='float:left; text-align:left; font-size:13px;'>A tobacco field in North Carolina</div>" + 
					"<div style='float:right; text-align:right; font-size:11px;'>Getty images</div>" + 
				"</div>";
				
				console.log("inline block");
			}
			
			return ret;
		}
		
		function carouselNav(e){
			if($('#carouselHolder').attr("tweening") != "true"){
				$('#carouselHolder').attr("tweening", "true");
				var dest = $('.carouselItem').css("left");
				var totalWidth = 0;
				
				if(dest == "auto"){dest = 0;}else{dest = parseInt(dest);}
				if(this.id == "rightArrow"){dest -= $('.carouselItem').outerWidth();}else{dest += $('.carouselItem').outerWidth();}
				$('.carouselItem').each(function(){totalWidth  += $(this).outerWidth(true);});
				
				if(dest <= totalWidth * -1){ //last
					$('.carouselItem').css("left", "0px");
					dest = $('.carouselItem').outerWidth() * -1;
				}else if(dest > 0){ //first			
					$('.carouselItem').css("left", (totalWidth *-1 + $('.carouselItem').outerWidth()) + "px");
					dest = (totalWidth *-1) + ($('.carouselItem').outerWidth() * 2);
				}

				$('.carouselItem').stop().animate({left: dest + "px"}, 
					500, function(){
						$('#carouselHolder').attr("tweening", "false");
					}
				)
			}
		}
	}
	
	function createPie(){
		var data = [
			[19, 5, 33, 26, 12]
		];
		
		var color = ["#009fe0", "#e71d73", "#6fcd52", "#dc9729", "#bb44dd"];
		var m = 10,
			r = 100,
			z = d3.scale.category20c();

		var svg = d3.select(".popup").selectAll("svg")
			.data(data)
			.enter().append("svg:svg")
			.attr("width", (r + m) * 2)
			.attr("height", (r + m) * 2)
			.append("svg:g")
			.attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

		svg.selectAll("path")
			.data(d3.layout.pie())
			.enter().append("svg:path").attr("class", "ring")
			.attr("r", r)
			.attr("d", d3.svg.arc()
			.innerRadius(1)
			.outerRadius(2))
			.on("mouseover", function(d, i, j){ //i is which arc //j is which SVG grouping
				var total = eval(data[j].join('+'));
			
				d3.select(this).transition().ease("linear").duration(250).style("fill", $.xcolor.opacity(color[i], '#000000', .25)).attr("d", d3.svg.arc().outerRadius((r / 1.25) - 2).innerRadius(r + 2));
				//$(".toolTip").css("background",color[i]).show().html("<div class='hoverTitle'></div><div class='hoverDetail'>" + d.data + " (" + (Math.round((d.data / total) * 1000) / 10) + "%)</div>");
				if(i == 0){$(".hoverTitle").append("MALE");}else if(i == 1){$(".hoverTitle").append("FEMALE");}else{$(".hoverTitle").append("OTHER");}
				
				if(this.parentNode.parentNode.childNodes[1 + i]){ //need this because there are only 2 people... but there can be more colors
					d3.select(this.parentNode.parentNode.childNodes[1 + i]).transition().ease("linear").duration(250).style("fill", $.xcolor.opacity(color[i], '#000000', .25));
				}
			})
			.on("mouseout", function(d, i){
				d3.select(this).style("fill", color[i]);
				d3.select(this).transition().duration(250).style("fill", color[i]).attr("d", d3.svg.arc().outerRadius(r / 1.25).innerRadius(r));
				//$(".toolTip").hide();
				
				if(this.parentNode.parentNode.childNodes[1 + i]){ //need this because there are only 2 people... but there can be more colors
					d3.select(this.parentNode.parentNode.childNodes[1 + i]).transition().ease("linear").duration(250).style("fill", $.xcolor.opacity(color[i], '#000000', 0));
				}
			})
			.style("fill", function(d, i){ return color[i];})
			.transition().ease("expo").duration(250).attr("d", d3.svg.arc().outerRadius(r / 1.25).innerRadius(r));
	}
	
	function createHerePie(where){
		console.log("creating the here pie!");
	
		var data = [
			[19, 5, 33, 26, 12]
		];
		
		var color = ["#009fe0", "#e71d73", "#6fcd52", "#dc9729", "#bb44dd"];
		var m = 10,
			r = 100,
			z = d3.scale.category20c();

		var svg = d3.select(where).selectAll("svg")
			.data(data)
			.enter().append("svg:svg")
			.attr("width", (r + m) * 2)
			.attr("height", (r + m) * 2)
			.append("svg:g")
			.attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

		svg.selectAll("path")
			.data(d3.layout.pie())
			.enter().append("svg:path").attr("class", "ring")
			.attr("r", r)
			.attr("d", d3.svg.arc()
			.innerRadius(1)
			.outerRadius(2))
			.on("mouseover", function(d, i, j){ //i is which arc //j is which SVG grouping
				if($($(where).parent()[0]).attr("class") == "overlay"){
					var total = eval(data[j].join('+'));
				
					d3.select(this).transition().ease("linear").duration(250).style("fill", $.xcolor.opacity(color[i], '#000000', .25)).attr("d", d3.svg.arc().outerRadius((r / 1.25) - 2).innerRadius(r + 2));
					//$(".toolTip").css("background",color[i]).show().html("<div class='hoverTitle'></div><div class='hoverDetail'>" + d.data + " (" + (Math.round((d.data / total) * 1000) / 10) + "%)</div>");
					if(i == 0){$(".hoverTitle").append("MALE");}else if(i == 1){$(".hoverTitle").append("FEMALE");}else{$(".hoverTitle").append("OTHER");}
					
					if(this.parentNode.parentNode.childNodes[1 + i]){ //need this because there are only 2 people... but there can be more colors
						d3.select(this.parentNode.parentNode.childNodes[1 + i]).transition().ease("linear").duration(250).style("fill", $.xcolor.opacity(color[i], '#000000', .25));
					}
				}
			})
			.on("mouseout", function(d, i){
				if($($(where).parent()[0]).attr("class") == "overlay"){
					d3.select(this).style("fill", color[i]);
					d3.select(this).transition().duration(250).style("fill", color[i]).attr("d", d3.svg.arc().outerRadius(r / 1.25).innerRadius(r));
					//$(".toolTip").hide();
					
					if(this.parentNode.parentNode.childNodes[1 + i]){ //need this because there are only 2 people... but there can be more colors
						d3.select(this.parentNode.parentNode.childNodes[1 + i]).transition().ease("linear").duration(250).style("fill", $.xcolor.opacity(color[i], '#000000', 0));
					}
				}
			})
			.style("fill", function(d, i){ return color[i];})
			.transition().ease("expo").duration(250).attr("d", d3.svg.arc().outerRadius(r / 1.25).innerRadius(r));
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////									
	// FUNCTIONS FOR TESTING:			
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function consoleLogOnce(d){
		if(testLogVariable == 100){
			console.log(d[0]);
			console.log(d[1]);
			
			testLogVariable = 0;
		}
		
		testLogVariable++;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////									
// AFTER YOUR CODE IS EXECUTED:			
////////////////////////////////////////////////////////////////////////////////////////////////////	

function reveal(){
	$('div').first().css("visibility", "visible");
	$(".loader").remove();
}