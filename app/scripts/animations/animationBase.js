define([

    'jquery',

    'eventdispatcher'

], function($, EventDispatcher) {

    'use strict';

    function AnimationBase() {}

    console.log($);

    // Returns a deferred object promise
    AnimationBase.prototype.animateDomOpen_ = function(view) {

        return view.$el.fadeIn(300);

    };

    // Returns a deferred object promise
    AnimationBase.prototype.animateDomClose_ = function(view) {

        return view.$el.fadeOut(300);

    };

    AnimationBase.prototype.doAnimationOpen_ = function(view) {

        view.model.set('state', 'doingAnimation');

        $.when(this.animateDomOpen_(view))

        .then(function() {

            AnimationBase.prototype.openPost_.call(null, view);

        });

    };

    AnimationBase.prototype.doAnimationClose_ = function(view) {

        view.model.set('state', 'doingAnimation');

        $.when(this.animateDomClose_(view))

        .then(function() {

            AnimationBase.prototype.closePost_.call(null, view);

        });

    };
    
    AnimationBase.prototype.openPre_ = function(view) {

        console.log('AnimationBase.openPre', view.model);

        view.model.set('state', 'openPre');

        this.doAnimationOpen_(view);

    };

    // Stub -- defined in constructor so this keyword behaves when unit testing
    AnimationBase.prototype.open = function(view) {

        console.log('AnimationBase.open', view.model);

        if (!view || !view.model) return;

        if (this.isOpen_(view)) return;

        this.openPre_(view);

    };

    AnimationBase.prototype.openPost_ = function(view) {

        view.model.set('state', 'openPost');

        view.model.set('state', 'open');

    };

    AnimationBase.prototype.closePre_ = function(view) {

        console.log('AnimationBase.closePre_', view.model);

        view.model.set('state', 'closePre');

        this.doAnimationClose_(view);

    };

    AnimationBase.prototype.close = function(view) {

        if (!view || !view.model) return;

        if (this.isClosed_(view)) return;

        this.closePre_(view);

    };

    AnimationBase.prototype.closePost_ = function(view) {

        view.model.set('state', 'closePost');

        view.model.set('state', 'close');

    };

    AnimationBase.prototype.isOpen_ = function(view) {

        return view.model.get('state') === 'open';

    };

    AnimationBase.prototype.isClosed_ = function(view) {

        return view.model.get('state') === 'close';

    };

    return AnimationBase;

});