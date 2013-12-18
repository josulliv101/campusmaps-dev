define([

    'jquery',

    'underscore',

    'backbone',

    'eventdispatcher',

    'scripts/views/searchbox',

    'scripts/controllers/searchboxController',

    'animationCSS'

], function($, _, Backbone, EventDispatcher, SearchboxView, SearchboxController, AnimationClass) {

    'use strict';

    function ViewManager(el) {

        this.$root = $(el);

    }

    ViewManager.prototype.init = function() {

        var searchboxView, searchboxController, $div;

        $div = $('<div></div>').attr('id', 'ui-search').appendTo(this.$root);

        // Never re-rendered
        searchboxView = new SearchboxView({

            model: this.modelFactory()

        });

        searchboxController = new SearchboxController(searchboxView, AnimationClass);

        searchboxView.render().$el.appendTo($div);

    }

    ViewManager.prototype.addCssFlag = function (name, options) {

        this.$root.addClass(name);

    }

    ViewManager.prototype.removeCssFlag = function (name, options) {

        this.$root.removeClass(name);

    }

    ViewManager.prototype.addCssFlagToHtmlTag = function (name, options) {

        $('html').addClass(name);

    }

    ViewManager.prototype.removeCssFlagToHtmlTag = function (name, options) {

        $('html').removeClass(name);

    }

    ViewManager.prototype.modelFactory = function (attrs) { return new Backbone.Model(attrs); }
/*  
    function addClass_(classname, options) {

      var prefix, segments = classname.split('-');

        options || (options = {});

        if (options.unique === true && segments.length > 1) {

            prefix = _.first(segments);

            $root.removeClass(function(index, classnames) {

                var classes = classnames.split(' ');

                return _.map(classes, function(class) {});
            });

        }

    }
*/
    return ViewManager

});
