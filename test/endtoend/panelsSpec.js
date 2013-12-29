
define([

  'jquery'

  , 'eventdispatcher'

  , 'animationCSS' // animationCSS3 animationBase

  , '../../scripts/controllers/searchboxController'

  , '../../scripts/views/searchbox'


], function ($, EventDispatcher, Animation, SearchboxController, SearchboxView) {

  describe('End-to-End Searchbox/Panel Tests', function () {

    var view, controller, panel;

    console.log('End-to-End Searchbox Tests');

    beforeEach(function() {

      // Spies need to be created before object created
      spyOn(SearchboxController.prototype, 'handleCommand').andCallThrough();

      spyOn(SearchboxController.prototype, 'doCommands').andCallThrough();
      
      // Fake the deferred resolve here because css transition events not fired in phantomjs
      spyOn(Animation.prototype, 'doAnimationClose_').andCallFake(function(view) {

        view.model.set('state', 'doingAnimation');

        Animation.prototype.closePost_.call(null, view);

        // So tests against css properties pass
        view.$el.hide();

        if (view.deferred) view.deferred.resolve( 'animation complete' );

      });

      spyOn(Animation.prototype, 'doAnimationOpen_').andCallFake(function(view) {

        view.model.set('state', 'doingAnimation');

        // So tests against css properties pass
        view.$el.show();

        Animation.prototype.openPost_.call(null, view);

      });

      view = new SearchboxView().render();

      controller = new SearchboxController(view, Animation);

      // Needs to spy after object creation
      spyOn(Animation.prototype, 'open').andCallThrough();

    });

    afterEach(function(){

      view = undefined;

      controller = undefined;

      // Need to unbind or a cmd event handler gets added each time
      EventDispatcher.unbind('cmd');

    });

    describe('Basics', function () {

      it('should exist', function () {

        expect( view.$el ).toBe('div.searchbox');

        expect( controller ).toBeDefined();

      });

    });


    describe('Z-index', function () {

      it('should have panels near top of searchbox with higher z-indexes', function () {

        EventDispatcher.trigger('cmd', 'panelA_panelB');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA') && isPanelOpen(view, 'panelB');

        });

        runs(function () {

          var cache = view.cache,

              panelA = cache['panelA'],

              panelB = cache['panelB'];

          expect(panelA.$el.css('z-index')).toBeGreaterThan(panelB.$el.css('z-index'));

        });

      });

    });

    describe('Classes', function () {

      it('should have the "animating" class removed after opened', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA');

        });

        runs(function () {

          var cache = view.cache,

              panelA = cache['panelA'];

          expect(panelA.$el).not.toHaveCss('animating');

        });

      });

    });

    describe('Create new panel', function () {

      it('should create a new panel in response to the cmd', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        // General panel container created when searchbox view rendered
        expect( view.$('#panels') ).toExist();

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

        // Async call for panel js
        waitsFor(function () {

          return isPanelOpen(view, 'panelA');

        });

        runs(function () {

          expect(SearchboxController.prototype.doCommands).toHaveBeenCalled();

          expect(Animation.prototype.open).toHaveBeenCalled();

          expectVisible(view, 'panelA');

        });

      });

      it('should create multiple panels in response to the cmd', function () {

        EventDispatcher.trigger('cmd', 'panelA_panelB_CampusList');

        // General panel container created when searchbox view rendered
        expect( view.$('#panels') ).toExist();

        waitsFor(function () {

          return isPanelOpen(view, 'panelA') && isPanelOpen(view, 'panelB') && isPanelOpen(view, 'CampusList');

        });

        runs(function () {

          expectVisible(view, 'panelA');

          expectVisible(view, 'panelB');

          expectVisible(view, 'CampusList');

        });
        

      });

      it('should hide current panels when new ones are displayed', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA');

        });

        runs(function () {
 
          expectVisible(view, 'panelA');

          EventDispatcher.trigger('cmd', 'panelB');

          waitsFor(function () {

            return isCampusListlosed(view, 'panelA') && isPanelOpen(view, 'panelB');

          });

          runs(function () {

            expectVisible(view, 'panelB');

            expectNotVisible(view, 'panelA');

          });

        });

      });

      it('should keep panel open if already open', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA');

        });

        runs(function () {

          // Call panelA again
          EventDispatcher.trigger('cmd', 'panelA');

          // No async calls needed
          expectVisible(view, 'panelA');

        });

      });

      it('should keep one panel open and shut the other open panel', function () {

        // First open both panels
        EventDispatcher.trigger('cmd', 'panelA_panelB');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA') && isPanelOpen(view, 'panelB');

        });

        runs(function () {

          expectVisible(view, 'panelA');

          expectVisible(view, 'panelB');

          EventDispatcher.trigger('cmd', 'panelB');

          waitsFor(function () {

            return isCampusListlosed(view, 'panelA') && isPanelOpen(view, 'panelB');

          });

          runs(function () {

            expectNotVisible(view, 'panelA');

            expectVisible(view, 'panelB');

          });

        });

      });

    });

  });

});

function expectVisible(view, panelid) {

  expect( view.$('#' + panelid) ).toExist();
  expect( view.$('#' + panelid) ).toHaveClass('panel-container');
  expect( view.$('#' + panelid) ).toHaveCss({ display: 'block' });

}

function expectNotVisible(view, panelid) {

  expect( view.$('#' + panelid) ).toExist();
  expect( view.$('#' + panelid) ).toHaveClass('panel-container');
  expect( view.$('#' + panelid) ).toHaveCss({ display: 'none' });

}

function isPanelOpen(view, panelid) {

  return view.cache[panelid] && view.cache[panelid].model.get('state') === 'open';

}

function isCampusListlosed(view, panelid) {

  return view.cache[panelid] && view.cache[panelid].model.get('state') === 'close';

}