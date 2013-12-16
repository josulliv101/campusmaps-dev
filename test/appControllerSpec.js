
define([

  '../scripts/controllers/appController'

], function (AppController) {

  describe('App Controller Tests', function () {

    var controller;

    beforeEach(function() {

      var div = document.createElement('div');

      document.getElementsByTagName('body')[0].appendChild(div);

      controller = new AppController(div);

      controller.init();

    });

    afterEach(function(){

        $(window).unbind('resize');

        controller.$root = null;

        controller = null;

        Backbone.history.stop();

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( controller ).toBeDefined();

      });

      it('should have an init method', function () {

        expect( controller.init ).toBeDefined();

      });

      it('should have a root dom element', function () {

        expect( controller.$root ).toBeDefined();

      });

      it('should have a window resize listener', function () {

        var events = $._data( window, 'events' );
 
        console.log('window', events['resize']);

        expect( events['resize'] ).toBeDefined();

      });

      it('should have a reference to the router', function () {

        expect(controller.router).toBeDefined();

      });

      it('should trigger a resize event on initialization', function () {

        //expect(AppController.prototype.confirmResizeEvent_).toHaveBeenCalled();

      });

      it('should return a deferred object when getData called', function () {

        //expect( controller.getData().promise ).toBeDefined();

      });
 
    });

  });

});
