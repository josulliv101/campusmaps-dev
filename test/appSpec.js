
define([

  '../scripts/app'

  , '../scripts/controllers/appController'

  , 'eventdispatcher'

], function (App, AppController, EventDispatcher) {

  describe('App Tests', function () {

    var app;

    beforeEach(function() {

      // Fake the router parsing a querystring
      //spyOn(AppController.prototype, 'confirmResizeEvent_');

      app = new App(document.getElementsByTagName('body')[0], { vizid: 'leaflet' });

    });

    afterEach(function(){

        app = null;

        Backbone.history.stop();

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( app ).toBeDefined();

      });

      it('should have an init method', function () {

        expect( app.init ).toBeDefined();

      });

      it('should have a controller defined', function () {

        expect( app.controller ).toBeDefined();

      });

      it('should throw an error if no root dom element', function () {

        // Creating a new app will cause error if not stopped
        

        var el = document.getElementsByTagName('body')[0];

        expect( function() { var a1 = new App();  } ).toThrow();

        Backbone.history.stop();

        expect( function() { var a2 = new App(el, {});  } ).not.toThrow();

      });

      it('should have the truth object populated from passed-in config settings', function () {

        app.init();

        waitsFor(function () {

          return !!app.controller.router.settings;

        });

        runs(function () {

          expect( app.controller.getTheTruth().get('vizid') ).toBe('leaflet'); 

        });

      });

    });

  });

});
