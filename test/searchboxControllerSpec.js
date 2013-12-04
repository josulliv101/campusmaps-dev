
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
      spyOn(SearchboxController.prototype, 'handleCommand').andCallThrough();

      spyOn(SearchboxController.prototype, 'doCommands');

      spyOn(FakeView.prototype, 'closePanels');

      controller = new SearchboxController(new FakeView());

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

    describe('handleCommand Function', function () {
 
      it('should handle to a cmd event with view function.', function () {

        EventDispatcher.trigger('cmd', 'mycommand', { yo: 'hi' });

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

      });

      it('should call the view closePanels fn if forceClose option is true.', function () {

        EventDispatcher.trigger('cmd', 'mycommand', { forceClose: true });

        expect(FakeView.prototype.closePanels).toHaveBeenCalled();

      });

      it('should not call the view closePanels fn if forceClose option is not true.', function () {

        EventDispatcher.trigger('cmd', 'mycommand');

        expect(FakeView.prototype.closePanels).not.toHaveBeenCalled();

      });

      it('should split the cmd text into an array of commands.', function () {

        EventDispatcher.trigger('cmd', 'cmd1_cmd2');

        expect(controller.cmds.length).toEqual(2);

        EventDispatcher.trigger('cmd', 'cmd1');

        expect(controller.cmds.length).toEqual(1);

        EventDispatcher.trigger('cmd');

        expect(controller.cmds.length).toEqual(0);

        EventDispatcher.trigger('cmd', '');

        expect(controller.cmds.length).toEqual(0);

      });

    });

    describe('doCommands Function', function () {
 
      it('should be called in response to a cmd event.', function () {

        EventDispatcher.trigger('cmd', 'mycommand', { yo: 'hi' });

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

      });

      it('should be called in response to a cmd event.', function () {

        EventDispatcher.trigger('cmd', 'mycommand', { yo: 'hi' });

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

      });

    });

  });


  function FakeView() {}

  FakeView.prototype.closePanels = function() {};

});