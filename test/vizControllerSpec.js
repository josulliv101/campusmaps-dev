
define([

    '../scripts/controllers/vizController'

  , 'eventdispatcher'

], function (VizController, EventDispatcher) {

  describe('Viz Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(VizController.prototype, 'handleTruthChange');

      spyOn(VizController.prototype, 'handleChangeViz');

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
 
    });

    describe('Functions', function () {

     it('should have an init method', function () {

        expect( VizController.prototype.init ).toBeDefined();

      });

     it('should have a method to update a location model icon & label', function () {

        var locations = [];

        expect( VizController.prototype.setIconsAndLabels ).toBeDefined();

      });

    });

    describe('Events', function () {

      it('should have a listener for the App Controller forwarding on the changed ruth attrs', function () {

        // Events aren't ansync (unless the handling itself  involves an async method)
        EventDispatcher.trigger('delegateTruth', { 'test': 123 });

        expect( VizController.prototype.handleTruthChange ).toHaveBeenCalled();

      });
 
      it('should have a listener for a new viz', function () {

        // Events aren't ansync (unless the handling itself  involves an async method)
        EventDispatcher.trigger('change:viz', { 'id': 'myviz' });

        expect( VizController.prototype.handleChangeViz ).toHaveBeenCalled();

      });

    });

  });

});