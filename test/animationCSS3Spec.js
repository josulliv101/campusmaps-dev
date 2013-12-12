
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

    describe('Basics', function () {

      it('should exist', function () {

        expect( animation.open ).toBeDefined();

      });

      it('should call appropriate methods', function () {

        animation.open(view);

        expect(AnimationCSS.prototype.open).toHaveBeenCalled();

        expect(AnimationCSS.prototype.openPre_).toHaveBeenCalled();

        expect(AnimationCSS.prototype.doAnimationOpen_).toHaveBeenCalled();

        expect(AnimationCSS.prototype.animateDomOpen_).toHaveBeenCalled();
      
      });

      it('should call add 4 event listeners for css animation end event', function () {

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

  });

});

function FakeView() { this.$el = $('<div><div class="panel"></div></div>'); }

FakeView.prototype.$ = function() { return this.$el.find('.panel'); }

function FakeModel() { this.state = "close"; }

FakeModel.prototype.get = function(attr) { return this.state; };

FakeModel.prototype.set = function(attr, val) { this.state = val; };