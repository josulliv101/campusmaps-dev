
define([

  'jquery',

  'eventdispatcher',

  '../scripts/animations/animationBase'

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

        expect( Animation.prototype.isOpen_ ).toBeDefined();

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

      it('should trigger an event', function () {

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

      it('should call closePre if not already open', function () {

        spyOn(Animation.prototype, 'closePre_').andCallThrough();

        // Stop action here
        spyOn(Animation.prototype, 'doAnimationClose_');

        Animation.prototype.close.call(animation, view);

        expect( Animation.prototype.closePre_ ).toHaveBeenCalled();

        expect( view.model.state ).toBe('closePre');

      });

      it('should trigger an event', function () {

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
  
    });

  });
  
  function FakeView() {}

  function FakeModel() { this.state = ""; }

  FakeModel.prototype.get = function(attr) { return this.state; };

  FakeModel.prototype.set = function(attr, val) { this.state = val; };

  FakeModel.prototype.trigger = function() {};

});