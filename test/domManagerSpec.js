
define([

  'jquery'

  , '../scripts/DomManager'

], function ($, DomManager) {

  describe('DomManager Tests', function () {

  	var dm, events;

    beforeEach(function() {

		dm = DomManager.getInstance();

		events = $._data( window, 'events' );

		spyOn(events['resize'][0], 'handler').andCallThrough();
		

		$('<div></div>').attr('id', 'mydiv').appendTo($('body'));

    });

    afterEach(function(){

    	$('#mydiv').remove();

    });

    describe('Basic', function () {

		it('should exist', function () {

			expect( $('body').length ).toEqual(1);

		});

		it('should get a singleton of the DomManager', function () {

        	expect( dm ).toBeDefined();

        	expect( dm ).toBe(DomManager.getInstance());

		});

		it('should have a default root dom element set', function () {

        	expect( dm.$root  ).toBeDefined();

        	console.log('dm.$root', dm.$root );

        	expect( dm.$root[0].nodeType  ).toBeDefined();

        	//expect( dm ).toBe(DomManager.getInstance());

		});

		it('should be able to change the root element', function () {

			dm.setAppRoot(document.getElementById('mydiv'));

        	expect( dm.$root.attr('id')  ).toEqual('mydiv');

		});

    });


    describe('Events', function () {

		it('should have a window resize listener', function () {

			var events = $._data( window, 'events' );

			console.log('window', events['resize']);

			expect( events['resize'] ).toBeDefined();

		});

		it('should listen for a resize dom event', function () {

			$(window).trigger('resize');

			events = $._data( window, 'events' );

			expect( events['resize'][0].handler ).toHaveBeenCalled();

		});

	});

  });

});

