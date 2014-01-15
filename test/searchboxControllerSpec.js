
define([

  'jquery', 

  '../scripts/controllers/searchboxController', 

  '../scripts/domManager',

  'eventdispatcher', 

  '../../bower_components/jasmine-jquery/lib/jasmine-jquery'

], function ($, SearchboxController, DomManager, EventDispatcher) {

  describe('Searchbox Controller Tests', function () {

    var controller;

    beforeEach(function() {

      // Spy needs to be created before controller instance
      spyOn(SearchboxController.prototype, 'handleCommand').andCallThrough();

      spyOn(SearchboxController.prototype, 'doCommands').andCallThrough();

      spyOn(SearchboxController.prototype, 'getCmds').andCallThrough();

      spyOn(SearchboxController.prototype, 'getViewPaths').andCallThrough();

      spyOn(SearchboxController.prototype, 'doView').andReturn(new FakeView());

      spyOn(FakeView.prototype, 'closePanels');

      spyOn(SearchboxController.prototype, 'getDependencies').andCallFake(function() {
        
        var dfd = $.Deferred();

        return dfd.promise();

      });

      controller = new SearchboxController(new FakeView());

      // Lives  on SearchboxController object not prototype
      spyOn(controller, 'loadViews').andCallThrough();


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
/*
      it('should open the view corresponding to the cmd.', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

      });*/

    });

    describe('doCommands Function', function () {
 
      it('should be called in response to a cmd event.', function () {

        EventDispatcher.trigger('cmd', 'mycommand', { yo: 'hi' });

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

      });

      it('should be called in response to a cmd event (fake view).', function () {

        controller.doCommands({ fakeCmd: FakeView });

        expect(SearchboxController.prototype.doView).toHaveBeenCalled();

      });

    });

   describe('loadViews Function', function () {
      
      it('should ...', function () {

        controller.loadViews('test');

        expect(controller.loadViews).toHaveBeenCalled();

        expect(SearchboxController.prototype.getCmds).toHaveBeenCalled();

        expect(SearchboxController.prototype.getDependencies).toHaveBeenCalled();

        expect(SearchboxController.prototype.getViewPaths).toHaveBeenCalled();

      });

    });

    describe('getViewPaths Function', function () {
 
      it('should return an empty array if no cmds.', function () {

        expect(controller.getViewPaths().length).toBe(0);

        expect(controller.getViewPaths([]).length).toBe(0);

      });

      it('should return an array with a length matching number of cmds.', function () {

        expect(controller.getViewPaths(['cmd1']).length).toBe(1);

        expect(controller.getViewPaths(['cmd1', 'cmd2']).length).toBe(2);

      });

      it('should return a path to the view file.', function () {

        var viewpaths;

        controller.searchpanelPath = 'fake/path';

        viewpaths = controller.getViewPaths(['cmd1', 'cmd2', 'cmd999']);

        expect(viewpaths[0]).toBe('fake/path/cmd1');

        expect(viewpaths[1]).toBe('fake/path/cmd2');

        expect(viewpaths[2]).toBe('fake/path/cmd999');

      });

    });

    describe('getDependencies Function', function () {
 
      it('should exists.', function () {

        expect(SearchboxController.prototype.getDependencies).toBeDefined();

      });

      it('should return a promise', function () {

        var obj = SearchboxController.prototype.getDependencies(['searchpanels/base']);

        expect(obj).toBeDefined();

        // It should have a promise function
        expect(obj.promise).toBeDefined();

      });

    });

    describe('getCmds Function', function () {
 
      it('should exists.', function () {

        expect(controller.getCmds).toBeDefined();

      });

      it('should return an array of cmds', function () {

        var cmds = controller.getCmds('view1');

        expect(cmds).toBeDefined();

        // It should have a promise function
        expect(cmds.length).toBe(1);

        cmds = controller.getCmds('view1_view2');

        expect(cmds.length).toBe(2);

        cmds = controller.getCmds('');

        expect(cmds.length).toBe(0);

      });

    });

  });


  function FakeView() { 

    var attrs = { width: function() { return 100; }, height: function() { return 100; }};

    this.el = attrs;

    this.$el = attrs;

    this.$panels = attrs;

  }

  FakeView.prototype.closePanels = function() {};

});