define([

    'jquery',

    'underscore',

    'backbone',

    'eventdispatcher',

    'scripts/views/searchbox'

], function($, _, Backbone, EventDispatcher, SearchboxView) {

    'use strict';

    function init_(root) {

        var searchboxView, $root = $(root),

            $div = $('<div></div>').attr('id', 'ui-search').appendTo($root);

        // Never re-rendered
        searchboxView = new SearchboxView({

            model: new Backbone.Model({})

        });

        searchboxView.render().$el.appendTo($div);

    };

    return {

        init: init_,

        modelFactory: function (attrs) { return new Backbone.Model(attrs); }

    };
});
