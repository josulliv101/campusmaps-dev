define([

    'jquery',

    'scripts/animations/animationBase'

], function($, Base) {

    'use strict';

    function AnimationCSS3() {}

    AnimationCSS3.prototype = new Base();

    AnimationCSS3.prototype.constructor = AnimationCSS3;  

    AnimationCSS3.prototype.animateDomOpen_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', function(e) {

            // 'one' function will only remove the 1 event triggered, 3 others will remain and need to be removed
            view.$el.unbind('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend');

            view.$('.panel').removeClass('slideDown');

            view.$('.panel').addClass('css3');

            dfd.resolve();

        }); 

        view.$el.show();

        view.$('.panel').addClass('slideDown');

        return dfd.promise();

    };

    AnimationCSS3.prototype.animateDomClose_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {

            view.$('.panel').removeClass('slideUp');

            dfd.resolve();

        });

        view.$('.panel').addClass('slideUp');

        return dfd.promise() ;

    };

    return AnimationCSS3;

});