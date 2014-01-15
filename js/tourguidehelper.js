//**********************************************************************************
// TourGuide Helper Function
// John Gerdsen
// 1/28/12
//
// Commonly used functions by TourGuide
//
//**********************************************************************************

//Add a resize handler to window to make sure TourGuide stays centered
$(document).ready(function () {
    $(window).resize(function () {
        // Make call to Utility Function
        centerBox();
    });
});

//Experimental
//Captures keypressed allowing user to invoke by pressing 'h'
$(document).keyup(function (e) {
    if (e.keyCode == 72) {
        $("#tourBox").toggle('slide', { direction: "up" }, 500);
    }
});

//Function that does the math to make sure control is centered
function centerBox() {
    //Get the window height and width        
    var winH = $(window).height();
    var winW = $(window).width();
    //Set the popup window to center
    //ALREADY SET IN CSS        
    //$("#tourControl").css('top', winH / 2 - $("#tourControl").height() / 2);
    $("#tourBox").css('left', winW / 2 - $("#tourBox").width() / 2);
    $("#tourBtn").css('left', winW / 2 - $("#tourBtn").width() / 2);
}

//Author: adameslinger.blogspot.com
function addOnloadEvent(fnc) {
    if (typeof window.addEventListener != "undefined")
        window.addEventListener("load", fnc, false);
    else if (typeof window.attachEvent != "undefined") {
        window.attachEvent("onload", fnc);
    }
    else {
        if (window.onload != null) {
            var oldOnload = window.onload;
            window.onload = function (e) {
                oldOnload(e);
                window[fnc]();
            };
        }
        else
            window.onload = fnc;
    }
}