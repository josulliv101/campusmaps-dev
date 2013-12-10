
define([

  'jquery'

  , 'eventdispatcher'

  , '../../scripts/animations/animationBase'

  , '../../scripts/controllers/searchboxController'

  , '../../scripts/views/searchbox'


], function ($, EventDispatcher, Animation, SearchboxController, SearchboxView, PanelViewA) {

  describe('End-to-End Searchbox Tests', function () {

    var view, controller, panel;

    beforeEach(function() {

      // Spies need to be created before object created
      spyOn(SearchboxController.prototype, 'handleCommand').andCallThrough();

      view = new SearchboxView().render();

      controller = new SearchboxController(view);

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

    describe('Create new panel', function () {

      it('should create a new panel in response to the cmd', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        expect(SearchboxController.prototype.handleCommand).toHaveBeenCalled();

        // General panel container created when searchbox view rendered
        expect( view.$('#panels') ).toExist();

          waitsFor(function () {

            return view.cache['panelA'] && view.cache['panelA'].model.get('state') === 'open';

          });

        });

        runs(function () {

          expect( view.$('#panelA') ).toExist();
          expect( view.$('#panelA') ).toHaveClass('in-queue');
          expect( view.$('#panelA') ).toHaveCss({ display: 'block' });

        });
        

      });

      it('should create multiple panels in response to the cmd', function () {

        EventDispatcher.trigger('cmd', 'panelA_panelB_panelC');

        // General panel container created when searchbox view rendered
        expect( view.$('#panels') ).toExist();

        waitsFor(function () {

          return isPanelOpen(view, 'panelA') && isPanelOpen(view, 'panelB') && isPanelOpen(view, 'panelC');

        });

        runs(function () {

          expect( view.$('#panelA') ).toExist();
          expect( view.$('#panelA') ).toHaveClass('in-queue');
          expect( view.$('#panelA') ).toHaveCss({ display: 'block' });

          expect( view.$('#panelB') ).toExist();
          expect( view.$('#panelB') ).toHaveClass('in-queue');
          expect( view.$('#panelB') ).toHaveCss({ display: 'block' });

          expect( view.$('#panelC') ).toExist();
          expect( view.$('#panelC') ).toHaveClass('in-queue');
          expect( view.$('#panelC') ).toHaveCss({ display: 'block' });

        });
        

      });

      it('should hide current panels when new ones are displayed', function () {

        EventDispatcher.trigger('cmd', 'panelA');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA');

        });

        runs(function () {

          EventDispatcher.trigger('cmd', 'panelB');

          waitsFor(function () {

            return isPanelClosed(view, 'panelA') && isPanelOpen(view, 'panelB');

          });

          runs(function () {

            expect( view.$('#panelB') ).toExist();
            expect( view.$('#panelB') ).toHaveClass('in-queue');
            expect( view.$('#panelB') ).toHaveCss({ display: 'block' });

            expect( view.$('#panelA') ).toExist();
            expect( view.$('#panelA') ).toHaveClass('in-queue');
            expect( view.$('#panelA') ).toHaveCss({ display: 'none' });

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

          expect( view.$('#panelA') ).toExist();
          expect( view.$('#panelA') ).toHaveClass('in-queue');
          expect( view.$('#panelA') ).toHaveCss({ display: 'block' });

        });

      });


      it('should keep one panel open and shut the other open panel', function () {

        // First open both panels
        EventDispatcher.trigger('cmd', 'panelA_panelB');

        waitsFor(function () {

          return isPanelOpen(view, 'panelA') && isPanelOpen(view, 'panelB');

        });

        runs(function () {

          // Call panelA again
          //EventDispatcher.trigger('cmd', 'panelA');
          expect( view.$('#panelA') ).toExist();
          expect( view.$('#panelA') ).toHaveClass('in-queue');
          expect( view.$('#panelA') ).toHaveCss({ display: 'block' });

          expect( view.$('#panelB') ).toExist();
          expect( view.$('#panelB') ).toHaveClass('in-queue');
          expect( view.$('#panelB') ).toHaveCss({ display: 'block' });

          EventDispatcher.trigger('cmd', 'panelB');

          waitsFor(function () {

            return isPanelClosed(view, 'panelA') && isPanelOpen(view, 'panelB');

          });

          runs(function () {

            // Call panelA again
            //EventDispatcher.trigger('cmd', 'panelA');
            expect( view.$('#panelA') ).toExist();
            expect( view.$('#panelA') ).toHaveClass('in-queue');
            expect( view.$('#panelA') ).toHaveCss({ display: 'none' });

            expect( view.$('#panelB') ).toExist();
            expect( view.$('#panelB') ).toHaveClass('in-queue');
            expect( view.$('#panelB') ).toHaveCss({ display: 'block' });

          });

        });

      });

  });

});

function isPanelOpen(view, panelid) {

  return view.cache[panelid] && view.cache[panelid].model.get('state') === 'open';

}

function isPanelClosed(view, panelid) {

  return view.cache[panelid] && view.cache[panelid].model.get('state') === 'close';

}