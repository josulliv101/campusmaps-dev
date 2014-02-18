define([

    'jquery',

    'eventdispatcher'

], function($, EventDispatcher) {

    'use strict';

    function AnimationBase() {}


    // Returns a deferred object promise
    AnimationBase.prototype.animateDomOpen_ = function(view) {

        view.$el.css({ overflow: 'hidden', top: '-50px' });

        return view.$el.show().animate({

                    top: '0px',

                    'max-height': '600px'

                }, {

                    duration: 400
                    
                })

    };

    // Returns a deferred object promise
    AnimationBase.prototype.animateDomClose_ = function(view) {

        view.$el.css('overflow', 'hidden');

        return view.$el.animate({

                    top: '-50px',

                    'max-height': '0px'

                }, {

                    duration: 400

                })

    };

    AnimationBase.prototype.doAnimationOpen_ = function(view) {

        var openFn = this.openPost_;

        view.model.set('state', 'doingAnimation');

        var dfd = this.animateDomOpen_(view);

        $.when(dfd)

        .then(function() {

            openFn(view);

            if (view.deferred) view.deferred.resolve( 'animation complete' );

        });

    };

    AnimationBase.prototype.doAnimationClose_ = function(view) {

        var closeFn = this.closePost_;

        view.model.set('state', 'doingAnimation');

        $.when(this.animateDomClose_(view))

        .then(function() {

            closeFn(view);

            if (view.deferred) view.deferred.resolve( 'animation complete' );

        });

    };
    
    AnimationBase.prototype.openPre_ = function(view) {

        console.log('AnimationBase.openPre', view.model);

        view.model.set('state', 'openPre');

        this.doAnimationOpen_(view);

    };

    // Stub -- defined in constructor so this keyword behaves when unit testing
    AnimationBase.prototype.open = function(view, position) {

        console.log('AnimationBase.open', this);

        if (!view || !view.model) return;

        if (_.exists(position)) view.$el.css('z-index', 999-position);

        if (this.isOpen_(view)) return;

        if (view.$el.hasClass('animating')) {

          console.log('open animation in progress');

          return false; 

        } 

        if (view.$el) view.$el.addClass('animating');

        // Needs to be created before triggering openPre_
        view.deferred = new $.Deferred();

        this.openPre_(view);

        return view.deferred.promise(); 

    };

    AnimationBase.prototype.openPost_ = function(view) {

        console.log('AnimationBase.openPost_', view.model);

        view.model.set('state', 'openPost');

        view.model.set('state', 'open');

        if (view.$el) view.$el.removeClass('animating state-closed');

        view.$el.addClass('state-opened');

    };

    AnimationBase.prototype.closePre_ = function(view) {

        console.log('AnimationBase.closePre_', view.model);

        view.model.set('state', 'closePre');

        console.log('this.doAnimationClose_', this.doAnimationClose_);
        
        this.doAnimationClose_(view);

    };

    AnimationBase.prototype.close = function(view) {

        if (!view || !view.model) return;

        if (this.isClosed_(view)) return;

        if (view.$el.hasClass('animating')) {

          console.log('close animation in progress');

          return false; 

        } 

        if (view.$el) view.$el.addClass('animating');

        // Needs to be created before triggering closePre
        view.deferred = new $.Deferred();

        this.closePre_(view);

        return view.deferred.promise(); 

    };

    AnimationBase.prototype.closePost_ = function(view) {

        console.log('AnimationBase.closePost_', view.model);

        view.model.set('state', 'closePost');

        view.model.set('state', 'close');

        if (view.$el) view.$el.removeClass('animating state-opened');

        if (view.$el) view.$el.css({ display: 'none' });

        view.$el.addClass('state-closed');

    };

    AnimationBase.prototype.isOpen_ = function(view) {

        return view.model.get('state') === 'open';

    };

    AnimationBase.prototype.isClosed_ = function(view) {

        return view.model.get('state') === 'close';

    };

    return AnimationBase;

});