
define([

  '../scripts/app'

  , '../scripts/DomManager'

], function (App, DomManager) {

  describe('App Tests', function () {

    var app;

    beforeEach(function() {

      // Don't want to really start the router
      spyOn(App.prototype, 'init');

      spyOn(App.prototype, 'setRootElement');

      // These settings get overridden by any router settings
      app = new App(document.getElementsByTagName('body')[0], { vizpath: 'leaflet' });

      app.init();

      app.controller = new FakeController();

    });

    afterEach(function(){

        app = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( app ).toBeDefined();

      });

      it('should have a controller defined', function () {

        expect( app.controller ).toBeDefined();

      });

    });

    describe('DOM', function () {

      it('should have the first argument as the root dom element and throw no error', function () {

        var el = document.getElementsByTagName('body')[0];

        expect( function() { var a2 = new App(el, {});  } ).not.toThrow();

      });

    });

    describe('Error Handling', function () {

      it('should throw an error if no root dom element', function () {

        expect( function() { var a1 = new App();  } ).toThrow();

      });

    });

    describe('Functions', function () {

      it('should set a root DOM el on initialization', function () {

        expect( app.init ).toBeDefined();

      });

      it('should be able to set a root dom element', function () {

        expect( app.setRootElement ).toBeDefined();

      });

    });

  });

});

function FakeController() {}

FakeController.prototype.init = function() {}

FakeController.prototype.getData = function() {}

FakeController.prototype.startRouter = function() { return { settings: {}}; }

FakeController.prototype.setTheTruth = function() {}
