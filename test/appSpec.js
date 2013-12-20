
define([

  '../scripts/app',

  '../scripts/controllers/appController'

], function (App, AppController) {

  describe('App Tests', function () {

    var app;

    beforeEach(function() {

      // Fake the router parsing a querystring
      //spyOn(AppController.prototype, 'confirmResizeEvent_');

      app = new App({ el: document.getElementsByTagName('body')[0], vizid: 'leaflet' });

    });

    afterEach(function(){

        $(window).unbind('resize');

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
        Backbone.history.stop();

        var el = document.getElementsByTagName('body')[0];

        expect( function() { var a1 = new App(); a1.init(); } ).toThrow();

        expect( function() { var a2 = new App({ el: el });  a2.init(); } ).not.toThrow();

      });

      it('should have an object representing its current truth', function () {

        expect( app.truth ).toBeDefined();

      });

      it('should have the truth object populated from passed-in config settings', function () {

        // At this point the vizid should match the passed-in config vizid
        //expect( app.truth.get('vizid') ).toBe('leaflet'); 

        // Fake the router parsing a querystring
        spyOn(app.controller, 'getRouterSettings').andReturn({ vizid: 'googlemap' });

        app.init();

        waitsFor(function () {

          return app.init === true;

        });

        runs(function () {

          // Now the app config settings have been overridden with any router settings
          expect( app.controller.getTheTruth().get('vizid') ).toBe('googlemap'); 

        });

      });
/* 
      it('should have the controller load a viz', function () {

        app.init();

        waitsFor(function () {

          return app.init === true;

        });

        runs(function () {

          // Only go this far since the handled event is debounced
          expect( AppController.prototype.confirmResizeEvent_ ).toHaveBeenCalled();

        });

      });*/

    });

  });

});
