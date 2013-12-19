
define([

  'jquery',

  '../scripts/domManager'

], function ($, DomManager) {

  describe('DomManager Tests', function () {

    var domManager, el;

    beforeEach(function() {

      spyOn(DomManager.prototype, 'handleDomResizeEvent');

      domManager = new DomManager();

      el = document.getElementsByTagName('body')[0];

      $('html').removeClass();

    });

    afterEach(function(){

      $(window).unbind('resize');

      domManager = null;

      el = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( domManager ).toBeDefined();

      });

      it('should throw an error if no root dom element is passed to init', function () {

        expect( function() { domManager.init(); } ).toThrow();

      });

      it('should not throw an error if a root dom element is passed to init', function () {

        expect( function() { domManager.init(el); } ).not.toThrow();

      });

      it('should have a $root element set', function () {

        domManager.init(el);

        expect( domManager.$root ).toBeDefined();

      });

    });

    describe('Adding/Removing Classes', function () {

      it('should be able to add a class to the root element', function () {

        domManager.init(el);

        domManager.cssFlag('myflag');

        expect( domManager.$root ).toHaveClass('myflag');

      });

      it('should be able to add multiple classes to the root element at once', function () {

        domManager.init(el);

        domManager.cssFlag('myflagA myflagB');

        expect( domManager.$root ).toHaveClass('myflagA');

        expect( domManager.$root ).toHaveClass('myflagB');

      });

      it('should be able to remove a class from the root element', function () {

        domManager.init(el);

        domManager.$root.addClass('myflag');

        domManager.cssFlag('myflag', { remove: true });

        expect( domManager.$root ).not.toHaveClass('myflag');

      });

      it('should be able to remove multiple classes from the root element', function () {

        domManager.init(el);

        domManager.$root.addClass('myflagA myflagB');

        domManager.cssFlag('myflagA myflagB', { remove: true });

        expect( domManager.$root ).not.toHaveClass('myflagA');

        expect( domManager.$root ).not.toHaveClass('myflagB');

      });

      it('should be able to add a class to the <html> tag', function () {

        domManager.init(el);

        domManager.cssFlag('myflag', { el: 'html' });

        expect( $('html') ).toHaveClass('myflag');

      });

      it('should be able to remove a class from the <html> tag', function () {

        domManager.init(el);

        $('html').addClass('myflagA myflagB');

        domManager.cssFlag('myflagA', { el: 'html', remove: true });

        console.log('html', $('html'));

        expect( $('html').hasClass('myflagA') ).toBe(false);

        expect( $('html').hasClass('myflagB') ).toBe(true);

      });

    });

    describe('Events', function () {

      it('should listen for a resize dom event', function () {

        domManager.init(el);

        $(window).trigger('resize');

        expect( DomManager.prototype.handleDomResizeEvent ).toHaveBeenCalled();

      });

    })

  });

});
