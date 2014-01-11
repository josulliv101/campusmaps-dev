
define([

    '../scripts/controllers/vizController'

  , 'eventdispatcher'

], function (VizController, EventDispatcher) {

  describe('Viz Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(VizController.prototype, 'handleTruthChange');

      controller = new VizController();

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

        //expect(controller.router).toBeDefined();

      });
 
    });

    describe('Functions', function () {

     it('should have an init method', function () {

        expect( VizController.prototype.handleTruthChange ).toBeDefined();

      });
/* 
      it('should have a getData method', function () {

        expect( AppController.prototype.getData ).toBeDefined();

      });

      it('should have a startRouter method', function () {

        expect( AppController.prototype.startRouter ).toBeDefined();

      });*/

    });

    describe('Events', function () {

      it('should have alistener for AppLevelTruthHandled', function () {

        expect( controller ).toBeDefined();

      });

      it('should handle theTruth change', function () {

        // Events aren't ansync (unless the handling itself  involves an async method)
        EventDispatcher.trigger('delegateTruth', { 'test': 123 });

        expect( VizController.prototype.handleTruthChange ).toHaveBeenCalled();

      });
 
    });

  });

});
