define([

    'jquery'

], function($) {

    'use strict';

    function AnimationJQueryAnimate() {}

    // Stub -- defined in constructor so this keyword behaves when unit testing
    AnimationJQueryAnimate.prototype.open = function(view) {

        view.$el.slideDown();

    };

    AnimationJQueryAnimate.prototype.close = function(view) {

        view.$el.slideUp();

    };

    return AnimationJQueryAnimate;

});