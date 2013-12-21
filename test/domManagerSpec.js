
define([

  'jquery',

  '../scripts/DomManager'

], function ($, DomManager) {

  describe('DomManager Tests', function () {

    var prototype = Object.getPrototypeOf(DomManager), 

      constructor = prototype.constructor;

    beforeEach(function() {

      $('html').removeClass();

    });

    afterEach(function(){

      $(window).unbind('resize');

      el = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( DomManager ).toBeDefined();

      });

      it('should have a $root element set', function () {

        expect( DomManager.$root ).toBeDefined();

      });

    });

    describe('Adding/Removing Classes', function () {

      it('should be able to add a class to the root element', function () {

        DomManager.cssFlag('myflag');

console.log('DomManager.$root', DomManager.$root);

        expect( DomManager.$root ).toHaveClass('myflag');

      });

      it('should be able to add multiple classes to the root element at once', function () {

        DomManager.cssFlag('myflagA myflagB');

        expect( DomManager.$root ).toHaveClass('myflagA');

        expect( DomManager.$root ).toHaveClass('myflagB');

      });

      it('should be able to remove a class from the root element', function () {

        DomManager.$root.addClass('myflag');

        DomManager.cssFlag('myflag', { remove: true });

        expect( DomManager.$root ).not.toHaveClass('myflag');

      });

      it('should be able to remove multiple classes from the root element', function () {

        DomManager.$root.addClass('myflagA myflagB');

        DomManager.cssFlag('myflagA myflagB', { remove: true });

        expect( DomManager.$root ).not.toHaveClass('myflagA');

        expect( DomManager.$root ).not.toHaveClass('myflagB');

      });

      it('should be able to add a class to the <html> tag', function () {

        DomManager.cssFlag('myflag', { el: 'html' });

        expect( $('html') ).toHaveClass('myflag');

      });

      it('should be able to remove a class from the <html> tag', function () {

        $('html').addClass('myflagA myflagB');

        DomManager.cssFlag('myflagA', { el: 'html', remove: true });

        console.log('html', $('html'));

        expect( $('html').hasClass('myflagA') ).toBe(false);

        expect( $('html').hasClass('myflagB') ).toBe(true);

      });

    });

    describe('Events', function () {

      it('should have a window resize listener', function () {

        var instance = new constructor();

        var events = $._data( window, 'events' );
 
        console.log('window', events['resize']);

        expect( events['resize'] ).toBeDefined();

      });

      it('should listen for a resize dom event', function () {

        spyOn(prototype, 'handleDomResizeEvent');

        var instance = new constructor();

        $(window).trigger('resize');

        expect( prototype.handleDomResizeEvent ).toHaveBeenCalled();

      });

    })

  });

});

if(!Object.getPrototypeOf) {
  if(({}).__proto__===Object.prototype&&([]).__proto__===Array.prototype) {
    Object.getPrototypeOf=function getPrototypeOf(object) {
      return object.__proto__;
    };
  } else {
    Object.getPrototypeOf=function getPrototypeOf(object) {
      // May break if the constructor has been changed or removed
      return object.constructor?object.constructor.prototype:void 0;
    };
  }
}
