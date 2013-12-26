
define([

  '../scripts/controllers/appController'

], function (AppController) {

  describe('App Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(AppController.prototype, 'init');

      spyOn(AppController.prototype, 'getData');

      spyOn(AppController.prototype, 'setTheTruth');

      spyOn(AppController.prototype, 'handleTruthChange');

      // Return a fake router with some fake settings 
      spyOn(AppController.prototype, 'startRouter').andReturn({ settings: { campusid: 'grafton', vizpath: 'googlemap' }});

      controller = new AppController();
      
      controller.init();

    });

    afterEach(function(){

        controller = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( controller ).toBeDefined();

      });

      it('should have a reference to the router', function () {

        expect(controller.router).toBeDefined();

      });
 
    });

    describe('Functions', function () {

      it('should have an init method', function () {

        expect( AppController.prototype.init ).toBeDefined();

      });

      it('should have a getData method', function () {

        expect( AppController.prototype.getData ).toBeDefined();

      });

      it('should have a startRouter method', function () {

        expect( AppController.prototype.startRouter ).toBeDefined();

      });

    });

  });

});
