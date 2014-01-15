//**********************************************************************************
// TourGuide Class
// John Gerdsen
// 1/28/12
//
// Take an array of commands and elements and traverse through
// to display to the user the proper actions and flow of page and
// controls.
//
//**********************************************************************************

$.Class('TourGuide',

/* @static */
        {
        callbackUrl: null,
        callbackMethod: null,
        stepTimer: null,
        stepTimerTimeout: null,
        currentIndex: 0,
        isPlaying: false,
        currentElement: null,
        currentPosition: null,
        numberOfSteps: null,
        fxSpeed: 750,
        buttonText: null,
        position: null,
        direction: null,
        currentText: null,
        buttonId: null,
        speechAmplitude: 125,
        speechPitch: 45,
        speechSpeed: 76,
        speechGap: 2
    },

/* @dynamic/prototype */
        {

        init: function (position, buttonText, instructions) {
            // initialize with instructions sent from call
            this.instructions = instructions;
            this.currentIndex = 0;
            this.position = position;
            this.buttonText = buttonText;
            this.direction = (this.position == 'top') ? "up" : "down";
            this.numberOfSteps = instructions.length - 1;
            this.createUI();
            // add necessary DOM to page
        },

        reset: function () {
            //Reset DOM and JS to beginning
            clearTimeout(this.stepTimer);
            this.currentIndex = 0;
            this.currentPosition = null;
            this.currentElement = null;
            $("#stepTitle").html("");
            $("#stepInstruction").html("");
            $('#highlightOverlay').css({ top: 0, left: 0 });
        },
        dump: function (toDump) {
            // dump instructions array to screen
            //alert(varDump(this.instructions));
            alert(varDump(toDump));
        },

        start: function () {
            // start tour and call until array is traversed completely
            this.currentElement = this.instructions[this.currentIndex][0];
            this.currentPosition = $(this.currentElement).offset();
            $("#tourBox").animate({ top: (this.position == 'top') ? '-5' : 'null', bottom: (this.position == 'bottom') ? '-2' : 'null' }, this.fxSpeed);
            this.show();
            //this.dump(this.currentPosition);
        },

        show: function () {
            $("#stepTitle").html(this.instructions[this.currentIndex][1]);
            $("#stepInstruction").html(this.instructions[this.currentIndex][2]);
            $('#highlightOverlay').width($(this.currentElement).outerWidth());
            $('#highlightOverlay').height($(this.currentElement).outerHeight());
            $('#highlightOverlay').css({ top: this.currentPosition.top, left: this.currentPosition.left });
            $('#highlightOverlay').show("puff", { percent: 150 }, this.fxSpeed, this.doWeContinue());
        },

        hide: function () {
            $("#tourBox").animate({ top: (this.position == 'top') ? '-172' : 'null', bottom: (this.position == 'bottom') ? '-172' : 'null' }, this.fxSpeed);
            $('#highlightOverlay').hide("puff", { percent: 150 }, 500);
            this.reset();
        },

        dictate: function () {
            //Using eSpeak Javascript Port created by https://github.com/kripken/speak.js
            speak(this.instructions[this.currentIndex][2], { amplitude: this.speechAmplitude, wordgap: this.speechGap, pitch: this.speechPitch, speed: this.speechSpeed, noWorker: true });
        },

        doWeContinue: function () {
            //alert(this.currentIndex);
            if (this.isPlaying) {
                //TODO Clean up these references in timeout.
                var instance = this;
                this.stepTimer = setTimeout(function () {
                    instance.next();
                }, this.instructions[this.currentIndex][3]);
            }
        },

        next: function () {
            // advance slide
            if (this.currentIndex < this.numberOfSteps) {
                this.currentIndex++;
                this.resume();
            }
        },

        previous: function () {
            // reverse slide
            if (this.currentIndex >= 1) {
                this.currentIndex--;
                this.resume();
            }
        },

        stop: function () {
            // clear timeout and cancel all actions and set all elements back to original
        },

        pause: function () {
            // clear current timeout and wait for user input
            this.isPlaying = false;
            clearTimeout(this.stepTimer);
        },

        play: function () {
            this.isPlaying = true;
            this.start();
        },

        resume: function () {
            this.currentElement = this.instructions[this.currentIndex][0];
            this.currentPosition = $(this.currentElement).offset();
            this.show();
        },

        createUI: function (position, buttonText) {
            // call to tourguidehelper js
            this.assembleDOM();
            this.addTourButton();
            this.addEvents();
            centerBox();
        },

        assembleDOM: function () {
            // create any necessary UI elements for tour
            var $tourGuideDOM = $('<div id="tourBox"><div id="tourContent"><div id="controlClose"><img src="img/close16x16.png" width="16" height="16" alt="Close Tour" /></div><div id="stepContent"><div id="stepTitle" class="tk-facitweb"></div><div class="dictateBtn" id="dictateTour"><img src="img/speech.png" width="24" height="24" alt="Dictate" /></div><div id="stepInstruction" class="tk-facitweb"></div></div><div id="tourControls"><div id="itemContainer"><div class="controlItem" id="rwTour"><img src="img/rw32x32.png" width="24" height="24" alt="Rewind" /></div><div class="controlItem" id="psTour"><img src="img/pause32x32.png" width="24" height="24" alt="Pause" /></div><div class="controlItem" id="plTour"><img src="img/play32x32.png" width="24" height="24" alt="Play" /></div><div class="controlItem" id="ffTour"><img src="img/ff32x32.png" width="24" height="24" alt="Skip" /></div></div></div></div></div>');
            var $highlightOverlay = $('<div id="highlightOverlay"></div>');
            $('body').append($tourGuideDOM);
            (this.position == 'top') ? $('#tourBox').css('top', -172) : $('#tourBox').css('bottom', -172);
            $('body').append($highlightOverlay);
            $('body').append("<div id=\"audio\"></div>");
        },

        addTourButton: function (position, buttonText) {
            var $tourButton = $('<div id="tourBtn"></div>');
            (this.position == 'top') ? $($tourButton).appendTo('#tourBox') : $($tourButton).prependTo('#tourBox');
            $('#tourBtn').html(this.buttonText);
        },

        addEvents: function () {
            //Bind onClick to Close Button, we pass reference of this class to event handler
            $('#controlClose').bind('click', { instance: this }, function (event) {
                event.data.instance.hide();
            });
            $('#ffTour').bind('click', { instance: this }, function (event) {
                event.data.instance.next();
            });
            $('#rwTour').bind('click', { instance: this }, function (event) {
                event.data.instance.previous();
            });
            $('#plTour').bind('click', { instance: this }, function (event) {
                event.data.instance.play();
            });
            $('#psTour').bind('click', { instance: this }, function (event) {
                event.data.instance.pause();
            });
            $('#dictateTour').bind('click', { instance: this }, function (event) {
                event.data.instance.dictate();
            });
            $('#tourBtn').bind('click', { instance: this }, function (event) {
                event.data.instance.start();
            });
        },

        dispose: function () {
            // remove all traces
            this.callbackUrl = null;
            this.callbackMethod = null;
            this.stepTimer = null;
            this.currentIndex = null;
            this.isPlaying = false;
            this.currentElement = null;
            this.currentPosition = null;
            this.numberOfSteps = null;
            this.fxSpeed = null;
        }
    });