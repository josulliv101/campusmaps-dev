
define([

  'jquery'

  , '../scripts/ModuleManager'

  , '../scripts/DomManager'

], function ($, ModuleManager, DomManager) {

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

		it('should have a tmp div used for px measuring', function () {

        	expect( dm.$root.find('#tmp')  ).toBeDefined();

		});

    });

    describe('Measuring', function () {

		var ret, $div = $('<div/>'), items = [{ id: 1, txt: 'item1' }, { id: 2, txt: 'some other really really longer item' }, { id: 3, txt: 'small item' }];
		
		_.each(items, function(item) {

			$('<label/>').attr('id', item.id).css({ 'min-width': '80px', 'max-width': '120px', display: 'inline-block' }).html(item.txt).appendTo($div);
		});

		it('should get an array back the same size as elements measuring', function () {

			ret = dm.measure($div);

			expect( _.size(ret) ).toBe(3);

		});

		it('should get an object with keys match element ids', function () {

			ret = dm.measure($div);

			expect( ret[1] ).toBeDefined();

			expect( ret[2] ).toBeDefined();

			expect( ret[3] ).toBeDefined();

			expect( ret[4] ).not.toBeDefined();

		});

		it('should have width & height associated with each key', function () {

			ret = dm.measure($div);

			expect( ret[1].width ).toMatch(/\d{1,}/);

			expect( ret[1].height ).toMatch(/\d{1,}/);

			expect( ret[2].width ).toMatch(/\d{1,}/);

			expect( ret[2].height ).toMatch(/\d{1,}/);

			expect( ret[3].width ).toMatch(/\d{1,}/);

			expect( ret[3].height ).toMatch(/\d{1,}/);

		});

		it('should compare the size of 2 elements', function () {

			var el1 = $('<div/>').html('el1').height(100).width(20),

				el2 = $('<div/>').html('el2').height(200).width(20),

				ratio = dm.compareDimensions(el1, el2);

			expect( ratio.width ).toBe(1);

			expect( ratio.height ).toBe(.5);

		});

		it('should determine the center offset based on div dimensions', function () {

			var offset;

			$('#mydiv').width(320);

			$('#mydiv').height(480);

			offset = dm.getCenterOffset($('#mydiv'));

			expect( offset ).toEqual( { x: 0, y: 120 } );

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

