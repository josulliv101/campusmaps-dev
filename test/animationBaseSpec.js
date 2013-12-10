
define([

  'jquery',

  'eventdispatcher',

  'animation'

], function ($, EventDispatcher, Animation) {

  describe('Animation Base Tests', function () {

    var view, model, animation = new Animation();


    beforeEach(function() {

      view = new FakeView();

      view.model = new FakeModel();

      spyOn(Animation.prototype, 'animateDomOpen_').andCallFake(function() {

        Animation.prototype.openPost_.call(animation, view);

      });

      spyOn(Animation.prototype, 'animateDomClose_').andCallFake(function() {

        Animation.prototype.closePost_.call(animation, view);

      });

    });

    afterEach(function(){

        model = null;

        view = null;

    });

    describe('Basics', function () {

      it('should exist', function () {

        expect( Animation.prototype ).toBeDefined();

      });

      it('should have all the required functions', function () {

        expect( Animation.prototype.openPre_ ).toBeDefined();
        expect( Animation.prototype.open ).toBeDefined();
        expect( Animation.prototype.openPost_ ).toBeDefined();
        expect( Animation.prototype.closePre_ ).toBeDefined();
        expect( Animation.prototype.close ).toBeDefined();
        expect( Animation.prototype.closePost_ ).toBeDefined();

        expect( Animation.prototype.animateDomOpen_ ).toBeDefined();
        expect( Animation.prototype.animateDomClose_ ).toBeDefined();

        expect( Animation.prototype.isOpen_ ).toBeDefined();
        expect( Animation.prototype.isClosed_ ).toBeDefined();

      });
  
    });

    describe('The Open Functions', function () {

      it('should check if the model is already in the open state', function () {

        spyOn(Animation.prototype, 'isOpen_').andCallThrough();

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationOpen_');

        Animation.prototype.open.call(animation, view);

        expect( Animation.prototype.isOpen_ ).toHaveBeenCalled();

      });

      it('should return if the model state is already open', function () {

        spyOn(Animation.prototype, 'openPre_').andCallThrough();

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationOpen_');

        view.model.state = 'open';

        Animation.prototype.open.call(animation, view);

        expect( Animation.prototype.openPre_ ).not.toHaveBeenCalled();

      });

      it('should call openPre if not already open', function () {

        spyOn(Animation.prototype, 'openPre_').andCallThrough();

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationOpen_');

        Animation.prototype.open.call(animation, view);

        expect( Animation.prototype.openPre_ ).toHaveBeenCalled();

        expect( view.model.state ).toBe('openPre');

      });

      it('should call doAnimationOpen_', function () {

        spyOn(Animation.prototype, 'doAnimationOpen_');

        Animation.prototype.open.call(animation, view);

        expect( Animation.prototype.doAnimationOpen_ ).toHaveBeenCalled();

      });

      it('should call openPost if not already open', function () {

        spyOn(Animation.prototype, 'openPost_');

        animation.open(view);

        expect( animation.openPost_ ).toHaveBeenCalled();

        //expect( view.model.state ).toBe('openPre');

      });
  
    });

    describe('The Close Functions', function () {

      it('should return a deferred object', function () {

        // Stop action here
        spyOn(Animation.prototype, 'isClosed_');

        var ret = Animation.prototype.close.call(animation, view);

        expect( ret.promise ).toBeDefined();

      });

      it('should check if the model is already in the close state', function () {

        // Stop action here
        spyOn(Animation.prototype, 'isClosed_');

        Animation.prototype.close.call(animation, view);

        expect( Animation.prototype.isClosed_ ).toHaveBeenCalled();

      });

      it('should return if the model state is already closed', function () {

        spyOn(Animation.prototype, 'closePre_');

        view.model.state = 'close';

        Animation.prototype.close.call(animation, view);

        expect( Animation.prototype.closePre_ ).not.toHaveBeenCalled();

      });

      it('should call closePre if not already closed', function () {

        spyOn(Animation.prototype, 'closePre_').andCallThrough();

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationClose_');

        Animation.prototype.close.call(animation, view);

        expect( Animation.prototype.closePre_ ).toHaveBeenCalled();

        expect( view.model.state ).toBe('closePre');

      });

      it('should call doAnimationClose_', function () {

        spyOn(Animation.prototype, 'doAnimationClose_');

        Animation.prototype.close.call(animation, view);

        expect( Animation.prototype.doAnimationClose_ ).toHaveBeenCalled();

      });

      it('should call closePost if not already open', function () {

        spyOn(Animation.prototype, 'closePost_');

        Animation.prototype.close.call(animation, view);

        expect( Animation.prototype.closePost_ ).toHaveBeenCalled();

        //expect( view.model.state ).toBe('openPre');

      });

      it('should return a deferred object that gets called after close animation ends', function () {

        Animation.prototype.close.call(animation, view);

         waitsFor(function () {

          return view.deferred.state() === 'resolved';

        });

        runs(function () {

          expect(view.deferred.state()).toBe('resolved');

        });

      });
  
    });


    describe('Animation', function () {

      it('should not have the "animating" class when not opening/closing', function () {

        // Baseline
        expect( view.$el.hasClass('animating') ).toBe(false);

        // After an open
        Animation.prototype.open.call(animation, view);

        expect( view.$el.hasClass('animating') ).toBe(false);


        // After an open
        Animation.prototype.close.call(animation, view);
        
        expect( view.$el.hasClass('animating') ).toBe(false);

      });

      it('should have the "animating" class while opening', function () {

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationOpen_');

        spyOn(Animation.prototype, 'openPre_').andCallThrough();

        // Baseline
        expect( view.$el.hasClass('animating') ).toBe(false);

        Animation.prototype.open.call(animation, view);

        expect( view.$el.hasClass('animating') ).toBe(true);

        expect( Animation.prototype.openPre_ ).toHaveBeenCalled();

      });

      it('should have the "animating" class while closing', function () {

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationClose_');

        spyOn(Animation.prototype, 'closePre_').andCallThrough();

        // Baseline
        expect( view.$el.hasClass('animating') ).toBe(false);

        Animation.prototype.close.call(animation, view);

        expect( view.$el.hasClass('animating') ).toBe(true);

        expect( Animation.prototype.closePre_ ).toHaveBeenCalled();

      });

      it('should have an "open" state after opening', function () {

        // Baseline
        expect( view.model.get('state')).not.toBe('open');

        Animation.prototype.open.call(animation, view);

        expect( view.model.get('state')).toBe('open');

      });

      it('should have an "close" state after closing', function () {

        // First open it
        Animation.prototype.open.call(animation, view);

        // Baseline
        expect( view.model.get('state')).toBe('open');

        Animation.prototype.close.call(animation, view);

        expect( view.model.get('state')).toBe('close');

      });

      it('should not be able to open when "animating" class is present', function () {

        view.$el.addClass('animating');

        // First open it
        expect( Animation.prototype.open.call(animation, view) ).toBe(false);

      });

      it('should not be able to close when "animating" class is present', function () {

        view.$el.addClass('animating');

        // First open it
        expect( Animation.prototype.close.call(animation, view) ).toBe(false);

      });
  
    });


  });
  
  function FakeView() { this.$el = $('<div/>'); }

  function FakeModel() { this.state = ""; }

  FakeModel.prototype.get = function(attr) { return this.state; };

  FakeModel.prototype.set = function(attr, val) { this.state = val; };

  FakeModel.prototype.trigger = function() {};

});