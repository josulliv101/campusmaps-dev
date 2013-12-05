define([

    'jquery',

    'underscore',

    'scripts/animations/animationBase',

    'eventdispatcher'

], function($, _, Base, EventDispatcher) {

    'use strict';

    function AnimationCSS3() {}

    AnimationCSS3.prototype = new Base();

    AnimationCSS3.prototype.animateDomOpen_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {
        
            dfd.resolve();

        });
        
        view.$el.addClass('animated bounceInDown');

        return dfd.promise();

    };

    AnimationCSS3.prototype.animateDomClose_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {

            view.$el.removeClass('animated slideOutUp');

            dfd.resolve();

        });

        view.$el.removeClass('bounceInDown');

        view.$el.addClass('slideOutUp');

        dfd.resolve();

        return dfd.promise();

    };

    return AnimationCSS3;

});