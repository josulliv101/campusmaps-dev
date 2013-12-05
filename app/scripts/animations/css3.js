define([

    'jquery',

    'scripts/animations/animationBase'

], function($, AnimationBase) {

    'use strict';

    function AnimationCSS3() {}

    console.log($);

    // Stub -- defined in constructor so this keyword behaves when unit testing
    AnimationCSS3.prototype.open = function(view) {

        view.$el.removeClass('animated slideOutUp');
        
        view.$el.addClass('animated bounceInDown');

    };

    AnimationCSS3.prototype.close = function(view) {

        view.$el.removeClass('animated bounceInDown');

        view.$el.addClass('animated slideOutUp');

    };

    return AnimationCSS3;

});