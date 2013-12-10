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
         
        view.$('.panel').addClass('bounceInDown');

        view.$el.addClass('animated');

        return dfd.promise();

    };

    AnimationCSS3.prototype.animateDomClose_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {

            view.$('.panel').removeClass('slideOutUp');

            view.$el.removeClass('animated');

            dfd.resolve();

        });

        view.$('.panel').removeClass('bounceInDown');

        view.$('.panel').addClass('slideOutUp');

        //dfd.resolve();

        return dfd.promise();

    };

    return AnimationCSS3;

});