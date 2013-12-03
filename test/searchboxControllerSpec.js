
define([

  'jquery', 

  '../scripts/controllers/searchboxController', 

  'eventdispatcher', 

  '../../bower_components/jasmine-jquery/lib/jasmine-jquery'

], function ($, SearchboxController, EventDispatcher) {

  describe('Searchbox Controller Tests', function () {

    var controller;

    beforeEach(function() {

      // Spy needs to be created before controller instance
      spyOn(SearchboxController.prototype, 'handleCmd').andCallThrough();

      controller = new SearchboxController('cmd');

    });

    afterEach(function(){

      controller = undefined;

      // Need to unbind or a cmd event handler gets added each time
      EventDispatcher.unbind('cmd');

    });

    describe('Basics', function () {

      it('should exist', function () {

        expect( controller ).toBeDefined();

      });
  
    });

    describe('Events', function () {
 
      it('should respond to a cmd event.', function () {

        EventDispatcher.trigger('cmd', 'mycommand', { yo: 'hi' });

        expect(SearchboxController.prototype.handleCmd).toHaveBeenCalled();

      });

    });

  });

});