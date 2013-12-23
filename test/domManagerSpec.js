
define([

  'jquery',

  '../scripts/DomManager'

], function ($, DomManager) {

  describe('DomManager Tests', function () {

    var dm;

    beforeEach(function() {

      spyOn(DomManager.prototype, 'handleDomResizeEventDebounced');

      dm = DomManager.getInstance();

      

      $('html').removeClass();

    });

    afterEach(function(){

      //$(window).unbind('resize');

      el = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( dm ).toBeDefined();

      });

      it('should have a $root element set', function () {

        expect( dm.$root ).toBeDefined();

      });

    });

    describe('Adding/Removing Classes', function () {

      it('should be able to add a class to the root element', function () {

        dm.cssFlag('myflag');

console.log('DomManager.$root', dm.$root);

        expect( dm.$root ).toHaveClass('myflag');

      });

      it('should be able to add multiple classes to the root element at once', function () {

        dm.cssFlag('myflagA myflagB');

        expect( dm.$root ).toHaveClass('myflagA');

        expect( dm.$root ).toHaveClass('myflagB');

      });

      it('should be able to remove a class from the root element', function () {

        dm.$root.addClass('myflag');

        dm.cssFlag('myflag', { remove: true });

        expect( dm.$root ).not.toHaveClass('myflag');

      });

      it('should be able to remove multiple classes from the root element', function () {

        dm.$root.addClass('myflagA myflagB');

        dm.cssFlag('myflagA myflagB', { remove: true });

        expect( dm.$root ).not.toHaveClass('myflagA');

        expect( dm.$root ).not.toHaveClass('myflagB');

      });

      it('should be able to add a class to the <html> tag', function () {

        dm.cssFlag('myflag', { el: 'html' });

        expect( $('html') ).toHaveClass('myflag');

      });

      it('should be able to remove a class from the <html> tag', function () {

        $('html').addClass('myflagA myflagB');

        dm.cssFlag('myflagA', { el: 'html', remove: true });

        console.log('html', $('html'));

        expect( $('html').hasClass('myflagA') ).toBe(false);

        expect( $('html').hasClass('myflagB') ).toBe(true);

      });

    });

    describe('Events', function () {

      it('should have a window resize listener', function () {

        //var instance = new constructor();

        var events = $._data( window, 'events' );
 
        console.log('window', events['resize']);

        expect( events['resize'] ).toBeDefined();

      });

      it('should listen for a resize dom event', function () {

        

        //var instance = new constructor();

        $(window).trigger('resize');

        waits(800);

        runs(function () {

          expect( DomManager.prototype.handleDomResizeEventDebounced ).toHaveBeenCalled();

        });

        

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
