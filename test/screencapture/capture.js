
var page = require('webpage').create(),

	url = 'http://localhost:8000/index.htm';

page.viewportSize = { width: 1400, height: 1200 };

page.open(url, function (status) {

	page.evaluate( function() {
	    // find element to send click to
	    var element = document.querySelector( '#log li:first-child a' );

	 
	    // create a mouse click event
	    var event = document.createEvent( 'MouseEvents' );
	    event.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
	 
	    // send click to element
	    element.dispatchEvent( event );
	});
 
   window.setTimeout(function () {

            page.render('test/screencapture/index1400x1200.png');

				page.viewportSize = { width: 880, height: 660 };

				page.open(url, function (status) {
				 
				   window.setTimeout(function () {

				            page.render('test/screencapture/index880x660.png');

				            phantom.exit();

				        }, 1000);
				});

        }, 1000);
});