
define([

  'jquery',

  '../scripts/animations/animationCSS3'

], function ($, AnimationCSS) {

  describe('Animation CSS3 Tests', function () {

    var view, animation, listeners;

    beforeEach(function() {

      spyOn(AnimationCSS.prototype, 'open').andCallThrough();

      spyOn(AnimationCSS.prototype, 'openPre_').andCallThrough();

      spyOn(AnimationCSS.prototype, 'doAnimationOpen_').andCallThrough();

      spyOn(AnimationCSS.prototype, 'animateDomOpen_').andCallThrough();

      spyOn(AnimationCSS.prototype, 'openPost_').andCallThrough();


      view = new FakeView();

      view.model = new FakeModel();

      animation = new AnimationCSS();

    });

    afterEach(function(){

        animation = null;

        view = null;

        listeners = null;

    });

    describe('Opening', function () {

      it('should exist', function () {

        expect( animation.open ).toBeDefined();

      });

      it('should have not have the animating class when not animating', function () {

        expect(view.$el.find('.animating').length).toBe(0);  
      
      });

      it('should have return false if animating class present and open called', function () {

        view.$el.addClass('animating');

        expect(animation.open(view)).toBe(false);
      
      });

      it('should have animating class present after open called', function () {

        animation.open(view);

        expect(view.$el.hasClass('animating')).toBe(true); 
      
      });

      it('should not have the animating class when done animating', function () {

        animation.open(view);

        // Manually trigger for phantomjs
        setTimeout(function(){ view.$el.trigger('animationend'); }, 300);

        waitsFor(function () {

          return animation.isOpen_(view);

        });

        runs(function () {

          expect(view.$el.hasClass('animating')).toBe(false); 

        });
      
      });

      it('should call appropriate methods', function () {

        animation.open(view);

        expect(AnimationCSS.prototype.open).toHaveBeenCalled();

        expect(AnimationCSS.prototype.openPre_).toHaveBeenCalled();

        expect(AnimationCSS.prototype.doAnimationOpen_).toHaveBeenCalled();

        expect(AnimationCSS.prototype.animateDomOpen_).toHaveBeenCalled();
      
      });

      it('should have the css3 class', function () {

        animation.open(view);

        expect(view.$('css3').length).toBe(1);
      
      });

      it('should add 4 event listeners for css animation end event', function () {

        animation.open(view);

        listeners = $._data( view.$el[0], 'events' );

        // Since immediately checking, they should exist
        expect(listeners).toBeDefined();
        expect(listeners.animationend).toBeDefined();
        expect(listeners.webkitAnimationEnd).toBeDefined();
        expect(listeners.oAnimationEnd).toBeDefined();
        expect(listeners.msAnimationEnd).toBeDefined();
      
      });

      it('should call openPost_ after the css animation ends', function () {

        animation.open(view);

        // Manually trigger for phantomjs
        setTimeout(function(){ view.$el.trigger('animationend'); }, 300);

        waitsFor(function () {

          return animation.isOpen_(view);

        });

        runs(function () {

          expect(AnimationCSS.prototype.openPost_).toHaveBeenCalled();

        });

      
      });

      it('should have css animation event listeners removed', function () {

        animation.open(view);

        // Manually trigger for phantomjs
        setTimeout(function(){ view.$el.trigger('animationend'); }, 300);

        waitsFor(function () {

          return animation.isOpen_(view);

        });

        runs(function () {

          listeners = $._data( view.$el[0], 'events' );

          // Event listeners should have been removed
          expect(listeners).not.toBeDefined();

        });

      
      });

    });

    describe('Closing', function () {

      it('should exist', function () {

        expect( true ).toBeDefined();

      });


      it('should not have the animating class when not animating', function () {

        expect(view.$el.hasClass('animating')).toBe(false); 
      
      });

      it('should return undefined if not open when trying to close', function () {
        
        expect(animation.close(view)).toBeUndefined(); 
      
      });

      it('should return a deferred object', function () {

        view.model.state = 'open';

        expect(animation.close(view).promise).toBeDefined(); 
      
      });

      it('should have animating class present after close called', function () {

        view.model.state = 'open';

        animation.close(view);

        expect(view.$el.hasClass('animating')).toBe(true); 
      
      });

      it('should not have the animating class when done closing', function () {

        view.model.state = 'open';

        animation.close(view);

        // Manually trigger for phantomjs
        setTimeout(function(){ view.$el.trigger('animationend'); }, 300);

        waitsFor(function () {

          return animation.isClosed_(view);

        });

        runs(function () {

          expect(view.$el.hasClass('animating')).toBe(false); 

          console.log('close status', view.deferred.state());

        });
      
      });

      it('should a resolved deferred object after close', function () {

        view.model.state = 'open';

        animation.close(view);

        // Manually trigger for phantomjs
        setTimeout(function(){ view.$el.trigger('animationend'); }, 300);

        waitsFor(function () {

          return animation.isClosed_(view);

        });

        runs(function () {

          expect(view.deferred.state()).toBe('resolved'); 

        });
      
      });

    });

  });

});

function FakeView() { this.$el = $('<div><div class="panel"></div></div>'); }

FakeView.prototype.$ = function() { return this.$el.find('.panel'); }

function FakeModel() { this.state = "close"; }

FakeModel.prototype.get = function(attr) { return this.state; };

FakeModel.prototype.set = function(attr, val) { this.state = val; };